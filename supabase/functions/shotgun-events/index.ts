import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShotgunApiEvent {
  name: string;
  startTime: string;
  endTime: string;
  coverThumbnailUrl?: string;
  url: string;
  slug: string;
  description?: string;
  cancelledAt?: string | null;
}

const SHOTGUN_ORGANIZER_ID = "197795";
const SHOTGUN_API_BASE = "https://smartboard-api.shotgun.live/api/shotgun";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const token = authHeader.slice("Bearer ".length).trim();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("tag_ids, status")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.status !== "approved") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!profile.tag_ids?.length) {
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch tags with shotgun_match codes
  const { data: tags } = await supabase
    .from("tags")
    .select("id, shotgun_match")
    .in("id", profile.tag_ids)
    .not("shotgun_match", "is", null);

  const matchCodes = (tags || [])
    .map((t: { shotgun_match: string | null }) => t.shotgun_match)
    .filter((code: string | null): code is string => !!code)
    .map((code: string) => code.toLowerCase());

  if (!matchCodes.length) {
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Call Shotgun API
  const apiKey = Deno.env.get("SHOTGUN_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Shotgun API key not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const shotgunUrl = `${SHOTGUN_API_BASE}/organizers/${SHOTGUN_ORGANIZER_ID}/events?key=${apiKey}`;

  let shotgunData: { data?: ShotgunApiEvent[] };
  try {
    const shotgunRes = await fetch(shotgunUrl);

    if (!shotgunRes.ok) {
      const body = await shotgunRes.text();
      console.error(
        `Shotgun API returned ${shotgunRes.status}: ${body.slice(0, 500)}`
      );
      return new Response(
        JSON.stringify({ error: "Failed to fetch events from Shotgun" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    shotgunData = await shotgunRes.json();
  } catch (e) {
    console.error("Shotgun API request failed:", e);
    return new Response(
      JSON.stringify({ error: "Failed to fetch events from Shotgun" }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const events = shotgunData.data || [];

  // Filter events by matching codes in description
  const matched = events
    .filter((e) => {
      if (e.cancelledAt) return false;
      const desc = (e.description || "").toLowerCase();
      return matchCodes.some((code: string) => desc.includes(code));
    })
    .map((e) => ({
      name: e.name,
      startTime: e.startTime,
      endTime: e.endTime,
      coverThumbnailUrl: e.coverThumbnailUrl || null,
      url: e.url,
      slug: e.slug,
    }));

  return new Response(JSON.stringify(matched), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
