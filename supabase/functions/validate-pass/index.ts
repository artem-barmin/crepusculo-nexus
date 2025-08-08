import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        JSON.stringify({ 
          error: 'Missing user_id parameter',
          status: 'invalid',
          color: 'red',
          message: 'Invalid QR code - missing user ID',
          valid: false
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate event parameter
    if (event !== '62_crepusculo') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid event',
          status: 'invalid',
          color: 'red',
          message: 'QR code is not for this event',
          valid: false
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, full_name, status')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile:', error);
      return new Response(
        JSON.stringify({ 
          error: 'User not found',
          status: 'invalid',
          color: 'red',
          message: 'Invalid QR code - user not found',
          valid: false
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine status color and message
    let color: string;
    let message: string;
    let valid: boolean;

    switch (profile.status) {
      case 'approved':
        color = 'green';
        message = 'Pass is valid - Entry approved';
        valid = true;
        break;
      case 'pending':
        color = 'yellow';
        message = 'Application pending approval';
        valid = false;
        break;
      case 'rejected':
        color = 'red';
        message = 'Application rejected - Entry denied';
        valid = false;
        break;
      default:
        color = 'red';
        message = 'Invalid status - Entry denied';
        valid = false;
        break;
    }

    const response: ValidationResponse = {
      status: profile.status,
      color,
      message,
      username: profile.username || 'Unknown',
      full_name: profile.full_name || 'Unknown User',
      valid
    };

    console.log(`Pass validation for ${profile.username}: ${profile.status}`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in validate-pass function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        status: 'error',
        color: 'red',
        message: 'System error - Please try again',
        valid: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});