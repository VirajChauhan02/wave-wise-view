import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number; // mm in last hour
  windSpeed: number; // km/h
  description: string;
  pressure: number;
}

interface AlertThresholds {
  criticalRainfall: number; // mm/hour
  warningRainfall: number; // mm/hour
  criticalWindSpeed: number; // km/h
  warningWindSpeed: number; // km/h
  criticalHumidity: number; // %
  warningHumidity: number; // %
}

const defaultThresholds: AlertThresholds = {
  criticalRainfall: 50, // Heavy rain
  warningRainfall: 25,  // Moderate rain
  criticalWindSpeed: 80, // Very strong wind
  warningWindSpeed: 50,  // Strong wind
  criticalHumidity: 95,  // Very high humidity
  warningHumidity: 85    // High humidity
};

// City coordinates for weather API
const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Delhi": { lat: 28.7041, lon: 77.1025 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Surat": { lat: 21.1702, lon: 72.8311 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 },
  "Kanpur": { lat: 26.4499, lon: 80.3319 },
  "Nagpur": { lat: 21.1458, lon: 79.0882 },
  "Visakhapatnam": { lat: 17.6868, lon: 83.2185 },
  "Indore": { lat: 22.7196, lon: 75.8577 },
  "Thane": { lat: 19.2183, lon: 72.9781 },
  "Bhopal": { lat: 23.2599, lon: 77.4126 },
  "Patna": { lat: 25.5941, lon: 85.1376 },
  "Vadodara": { lat: 22.3072, lon: 73.1812 },
  "Ghaziabad": { lat: 28.6692, lon: 77.4538 },
  "Ludhiana": { lat: 30.9010, lon: 75.8573 },
  "Coimbatore": { lat: 11.0168, lon: 76.9558 },
  "Agra": { lat: 27.1767, lon: 78.0081 },
  "Madurai": { lat: 9.9252, lon: 78.1198 }
};

async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
    const coords = cityCoordinates[location];
    if (!coords) {
      console.log(`No coordinates found for ${location}`);
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get rainfall data (if available)
    const rainfall = data.rain?.['1h'] || 0; // mm in last hour
    
    return {
      location,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall,
      windSpeed: (data.wind.speed * 3.6), // Convert m/s to km/h
      description: data.weather[0].description,
      pressure: data.main.pressure
    };
  } catch (error) {
    console.error(`Error fetching weather for ${location}:`, error);
    return null;
  }
}

function determineAlertLevel(weather: WeatherData, thresholds: AlertThresholds): 'critical' | 'warning' | 'safe' {
  // Critical conditions
  if (
    weather.rainfall >= thresholds.criticalRainfall ||
    weather.windSpeed >= thresholds.criticalWindSpeed ||
    weather.humidity >= thresholds.criticalHumidity
  ) {
    return 'critical';
  }
  
  // Warning conditions
  if (
    weather.rainfall >= thresholds.warningRainfall ||
    weather.windSpeed >= thresholds.warningWindSpeed ||
    weather.humidity >= thresholds.warningHumidity
  ) {
    return 'warning';
  }
  
  return 'safe';
}

function generateAlertMessage(weather: WeatherData, alertLevel: 'critical' | 'warning' | 'safe'): { title: string; message: string } {
  const conditions = [
    weather.rainfall > 0 ? `Heavy rainfall: ${weather.rainfall}mm/hr` : null,
    weather.windSpeed > 40 ? `Strong winds: ${weather.windSpeed} km/h` : null,
    weather.humidity > 80 ? `High humidity: ${weather.humidity}%` : null
  ].filter(Boolean);

  if (alertLevel === 'critical') {
    return {
      title: `🚨 CRITICAL FLOOD ALERT - ${weather.location}`,
      message: `IMMEDIATE ACTION REQUIRED! Severe weather conditions detected in ${weather.location}. ${conditions.join(', ')}. Current weather: ${weather.description}. Please move to higher ground immediately and follow evacuation orders.`
    };
  } else if (alertLevel === 'warning') {
    return {
      title: `⚠️ FLOOD WARNING - ${weather.location}`,
      message: `Weather conditions in ${weather.location} indicate potential flooding risk. ${conditions.join(', ')}. Current weather: ${weather.description}. Please stay alert and avoid low-lying areas.`
    };
  } else {
    return {
      title: `✅ Weather Update - ${weather.location}`,
      message: `Current conditions in ${weather.location} are stable. Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h. Weather: ${weather.description}.`
    };
  }
}

async function sendLocationAlert(location: string, alertLevel: 'critical' | 'warning' | 'safe', title: string, message: string, weather: WeatherData) {
  try {
    const { error } = await supabase.functions.invoke('send-location-alerts', {
      body: {
        location,
        alertLevel,
        title,
        message,
        conditions: {
          waterLevel: weather.rainfall > 0 ? `${weather.rainfall}mm rainfall/hour` : 'Normal',
          rainfall: `${weather.rainfall}mm in last hour`,
          temperature: `${weather.temperature}°C`,
          windSpeed: `${weather.windSpeed} km/h`,
          humidity: `${weather.humidity}%`,
          pressure: `${weather.pressure} hPa`
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log(`Alert sent for ${location}: ${alertLevel}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send alert for ${location}:`, error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting weather monitoring check...');

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured');
    }

    // Get all unique locations from registrations
    const { data: locations, error: locError } = await supabase
      .from('user_registrations')
      .select('location')
      .neq('location', '');

    if (locError) {
      throw new Error(`Failed to fetch locations: ${locError.message}`);
    }

    const uniqueLocations = [...new Set(locations?.map(l => l.location) || [])];
    console.log(`Monitoring ${uniqueLocations.length} locations:`, uniqueLocations);

    const results = [];

    // Check weather for each location
    for (const location of uniqueLocations) {
      console.log(`Checking weather for ${location}...`);
      
      const weather = await getWeatherData(location);
      if (!weather) {
        results.push({ location, status: 'error', message: 'Failed to get weather data' });
        continue;
      }

      const alertLevel = determineAlertLevel(weather, defaultThresholds);
      const { title, message } = generateAlertMessage(weather, alertLevel);

      console.log(`${location}: ${weather.temperature}°C, ${weather.rainfall}mm/hr, ${weather.windSpeed}km/h - ${alertLevel.toUpperCase()}`);

      // Only send alerts for warning and critical conditions
      // For 'safe' conditions, we could send periodic updates (e.g., daily) instead of every check
      if (alertLevel === 'critical' || alertLevel === 'warning') {
        // Use background task to send alert without blocking response
        EdgeRuntime.waitUntil(
          sendLocationAlert(location, alertLevel, title, message, weather)
            .then(result => {
              console.log(`Alert result for ${location}:`, result);
            })
        );

        results.push({
          location,
          status: 'alert_sent',
          alertLevel,
          weather: {
            temperature: weather.temperature,
            rainfall: weather.rainfall,
            windSpeed: weather.windSpeed,
            humidity: weather.humidity,
            description: weather.description
          }
        });
      } else {
        results.push({
          location,
          status: 'normal',
          weather: {
            temperature: weather.temperature,
            rainfall: weather.rainfall,
            windSpeed: weather.windSpeed,
            humidity: weather.humidity,
            description: weather.description
          }
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Weather monitoring completed',
      timestamp: new Date().toISOString(),
      locationsChecked: uniqueLocations.length,
      results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in weather-monitor function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);