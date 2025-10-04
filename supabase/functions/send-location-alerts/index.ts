import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "npm:resend@^4.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationAlert {
  location: string;
  alertLevel: 'critical' | 'warning' | 'safe';
  title: string;
  message: string;
  conditions?: {
    waterLevel?: string;
    rainfall?: string;
    temperature?: string;
    windSpeed?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, alertLevel, title, message, conditions }: LocationAlert = await req.json();

    console.log(`Sending ${alertLevel} alert for ${location}:`, title);

    // Get all users registered for this location and alert level
    const { data: registrations, error: fetchError } = await supabase
      .from('user_registrations')
      .select('*')
      .eq('location', location)
      .eq(
        alertLevel === 'critical' ? 'alert_critical' : 
        alertLevel === 'warning' ? 'alert_warning' : 'alert_safe', 
        true
      );

    if (fetchError) {
      throw new Error(`Failed to fetch registrations: ${fetchError.message}`);
    }

    if (!registrations || registrations.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `No users registered for ${alertLevel} alerts in ${location}`,
        emailsSent: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${registrations.length} registered users for ${location}`);

    // Send emails to all registered users
    const emailPromises = registrations
      .filter(reg => reg.notification_email) // Only send to users who want email notifications
      .map(async (registration) => {
        try {
          const conditionsHtml = conditions ? `
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4 style="color: #1e293b; margin-top: 0;">Current Conditions:</h4>
              <ul style="color: #475569; margin: 0;">
                ${conditions.waterLevel ? `<li><strong>Water Level:</strong> ${conditions.waterLevel}</li>` : ''}
                ${conditions.rainfall ? `<li><strong>Rainfall:</strong> ${conditions.rainfall}</li>` : ''}
                ${conditions.temperature ? `<li><strong>Temperature:</strong> ${conditions.temperature}</li>` : ''}
                ${conditions.windSpeed ? `<li><strong>Wind Speed:</strong> ${conditions.windSpeed}</li>` : ''}
              </ul>
            </div>
          ` : '';

          const alertColor = alertLevel === 'critical' ? '#dc2626' : 
                           alertLevel === 'warning' ? '#f59e0b' : '#10b981';
          
          const alertIcon = alertLevel === 'critical' ? '🚨' : 
                          alertLevel === 'warning' ? '⚠️' : '✅';

          const emailResponse = await resend.emails.send({
            from: "FloodWatch System <noreply@resend.dev>",
            to: [registration.email],
            subject: `${alertIcon} ${alertLevel.toUpperCase()} FLOOD ALERT - ${registration.location}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: ${alertColor}; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">${alertIcon} FLOOD ALERT</h1>
                  <p style="color: white; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
                    ${alertLevel.toUpperCase()} - ${registration.location}
                  </p>
                </div>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #1e293b; margin-top: 0;">${title}</h2>
                  <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                    Hello ${registration.name},
                  </p>
                  <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                    ${message}
                  </p>
                  
                  ${conditionsHtml}
                  
                  <div style="background: ${alertLevel === 'critical' ? '#fef2f2' : alertLevel === 'warning' ? '#fffbeb' : '#f0fdf4'}; 
                              padding: 15px; border-radius: 8px; border-left: 4px solid ${alertColor}; margin: 20px 0;">
                    <p style="color: ${alertLevel === 'critical' ? '#7f1d1d' : alertLevel === 'warning' ? '#92400e' : '#14532d'}; margin: 0; font-weight: bold;">
                      ${alertLevel === 'critical' ? '🚨 IMMEDIATE ACTION REQUIRED' : 
                        alertLevel === 'warning' ? '⚠️ STAY ALERT AND PREPARED' : 
                        '✅ CONDITIONS ARE IMPROVING'}
                    </p>
                    <p style="color: ${alertLevel === 'critical' ? '#7f1d1d' : alertLevel === 'warning' ? '#92400e' : '#14532d'}; margin: 5px 0 0 0;">
                      ${alertLevel === 'critical' ? 'Follow evacuation orders immediately. Move to higher ground.' : 
                        alertLevel === 'warning' ? 'Monitor conditions closely and be ready to take action.' : 
                        'Continue to stay informed but risk levels are decreasing.'}
                    </p>
                  </div>
                  
                  <p style="color: #475569; line-height: 1.6; font-size: 14px; margin-top: 20px;">
                    This alert was sent because you registered for ${alertLevel} alerts in ${registration.location}.
                    Stay safe and follow local emergency guidelines.
                  </p>
                </div>
                
                <div style="text-align: center; padding: 20px 0;">
                  <div style="background: #1e293b; color: white; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 12px;">
                      © 2024 FloodWatch System | Emergency Alert: ${new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            `,
          });

          console.log(`Email sent to ${registration.email}:`, emailResponse.data?.id);
          return { success: true, email: registration.email, id: emailResponse.data?.id };
        } catch (error) {
          console.error(`Failed to send email to ${registration.email}:`, error);
          return { success: false, email: registration.email, error: error.message };
        }
      });

    const emailResults = await Promise.all(emailPromises);
    const successCount = emailResults.filter(result => result.success).length;
    const failureCount = emailResults.filter(result => !result.success).length;

    console.log(`Alert sent to ${successCount} users, ${failureCount} failures`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Location alert sent successfully`,
      location,
      alertLevel,
      emailsSent: successCount,
      emailsFailed: failureCount,
      totalRegistrations: registrations.length,
      results: emailResults
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-location-alerts function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);