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
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const event = url.searchParams.get('event');
    const format = url.searchParams.get('format') || 'html'; // Default to HTML

    if (!userId) {
      const errorResponse = { 
        error: 'Missing user_id parameter',
        status: 'invalid',
        color: 'red',
        message: 'Invalid QR code - missing user ID',
        valid: false
      };

      if (format === 'json') {
        return new Response(JSON.stringify(errorResponse), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const htmlContent = generateHTML(errorResponse);
      return new Response(htmlContent, {
        status: 400,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
    }

    // Validate event parameter
    if (event !== '62_crepusculo') {
      const errorResponse = { 
        error: 'Invalid event',
        status: 'invalid',
        color: 'red',
        message: 'QR code is not for this event',
        valid: false
      };

      if (format === 'json') {
        return new Response(JSON.stringify(errorResponse), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const htmlContent = generateHTML(errorResponse);
      return new Response(htmlContent, {
        status: 400,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
    }

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, full_name, status')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile:', error);
      const errorResponse = { 
        error: 'User not found',
        status: 'invalid',
        color: 'red',
        message: 'Invalid QR code - user not found',
        valid: false
      };

      if (format === 'json') {
        return new Response(JSON.stringify(errorResponse), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const htmlContent = generateHTML(errorResponse);
      return new Response(htmlContent, {
        status: 404,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
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

    if (format === 'json') {
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Returning HTML response for:', profile.username);
    
    const htmlContent = generateHTML(response);
    console.log('Generated HTML length:', htmlContent.length);
    
    return new Response(htmlContent, {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        ...corsHeaders
      },
    });

  } catch (error) {
    console.error('Error in validate-pass function:', error);
    const errorResponse = { 
      error: 'Internal server error',
      status: 'error',
      color: 'red',
      message: 'System error - Please try again',
      valid: false
    };

    const format = new URL(req.url).searchParams.get('format') || 'html';
    
    if (format === 'json') {
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const htmlContent = generateHTML(errorResponse);
    return new Response(htmlContent, {
      status: 500,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        ...corsHeaders
      },
    });
  }
});

function generateHTML(data: ValidationResponse | any): string {
  const backgroundColor = getBackgroundColor(data.color);
  const statusIcon = getStatusIcon(data.color);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>62 Crepusculo - Pass Validation</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            
            .status-header {
                background: ${backgroundColor};
                color: white;
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 30px;
                font-size: 24px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .icon {
                font-size: 32px;
            }
            
            .user-info {
                margin-bottom: 20px;
            }
            
            .user-name {
                font-size: 28px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            
            .username {
                font-size: 18px;
                color: #666;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 18px;
                color: #555;
                line-height: 1.5;
                margin-bottom: 30px;
            }
            
            .event-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                color: #666;
                font-size: 14px;
                border-left: 4px solid #667eea;
            }
            
            .timestamp {
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status-header">
                <span class="icon">${statusIcon}</span>
                <span>${data.valid ? 'VALID PASS' : 'INVALID PASS'}</span>
            </div>
            
            ${data.full_name ? `
                <div class="user-info">
                    <div class="user-name">${data.full_name}</div>
                    <div class="username">@${data.username}</div>
                </div>
            ` : ''}
            
            <div class="message">${data.message}</div>
            
            <div class="event-info">
                <strong>Event:</strong> 62 Crepusculo<br>
                <strong>Status:</strong> ${data.status}<br>
                <strong>Validation Time:</strong> ${new Date().toLocaleString()}
            </div>
            
            <div class="timestamp">
                Validated at ${new Date().toISOString()}
            </div>
        </div>
    </body>
    </html>
  `;
}

function getBackgroundColor(color: string): string {
  switch (color) {
    case 'green': return '#28a745';
    case 'yellow': return '#ffc107';
    case 'red': return '#dc3545';
    default: return '#6c757d';
  }
}

function getStatusIcon(color: string): string {
  switch (color) {
    case 'green': return '✅';
    case 'yellow': return '⚠️';
    case 'red': return '❌';
    default: return '❓';
  }
}