import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

interface ValidationResponse {
  status: string;
  color: string;
  message: string;
  username: string;
  full_name: string;
  valid: boolean;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const event = url.searchParams.get('event');

    if (!userId) {
      return new Response(
        'ERROR\nInvalid QR Code\nMissing user ID',
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' } 
        }
      );
    }

    // Validate event parameter
    if (event !== '62_crepusculo') {
      return new Response(
        'ERROR\nInvalid Event\nWrong QR code',
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' } 
        }
      );
    }

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, full_name, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !profile) {
      console.error('Error fetching profile:', error);
      return new Response(
        'ERROR\nUser Not Found\nInvalid QR code',
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' } 
        }
      );
    }

    console.log(`Pass validation for ${profile.username}: ${profile.status}`);

    // Return simple 3-line format
    const response = `${profile.full_name || 'Unknown User'}\n@${profile.username || 'unknown'}\n${profile.status.toUpperCase()}`;

    return new Response(response, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in validate-pass function:', error);
    return new Response(
      'ERROR\nSystem Error\nPlease try again',
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      }
    );
  }
});
