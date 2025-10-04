import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegistrationEmailRequest {
  name: string;
  email: string;
  location: string;
  state: string;
  notificationPreferences: string[];
  alertLevels: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, location, state, notificationPreferences, alertLevels }: RegistrationEmailRequest = await req.json();

    console.log('Sending registration email to:', email);

    const emailResponse = await resend.emails.send({
      from: "Weather Forecasting System <onboarding@resend.dev>",
      to: [email],
      subject: "Registration Confirmed - Weather Alert System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌤️ Weather Forecasting System</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Advanced Weather Forecasting & Flood Monitoring Alert System</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome ${name}!</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thank you for registering with FloodWatch System. Your registration has been successfully processed.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Registration Details:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Location:</strong> ${location}</li>
                <li><strong>State:</strong> ${state}</li>
                <li><strong>Notification Methods:</strong> ${notificationPreferences.join(', ')}</li>
                <li><strong>Alert Levels:</strong> ${alertLevels.join(', ')}</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="color: #92400e; margin: 0;">
                <strong>⚠️ Important:</strong> You will now receive weather and flood alerts based on your selected preferences. 
                Stay safe and follow emergency protocols when alerts are issued.
              </p>
            </div>
            
            <p style="color: #475569; line-height: 1.6;">
              Our system monitors weather conditions and water levels 24/7 to send you timely alerts and help keep you and your community safe.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0;">
            <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 Weather Forecasting System | Advanced Weather Forecasting & Flood Monitoring Alert System
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Registration email sent successfully',
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-registration-email function:", error);
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