-- Create user registrations table for flood alerts
CREATE TABLE public.user_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  notification_email BOOLEAN DEFAULT false,
  notification_sms BOOLEAN DEFAULT false,
  notification_push BOOLEAN DEFAULT false,
  alert_critical BOOLEAN DEFAULT true,
  alert_warning BOOLEAN DEFAULT false,
  alert_safe BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert registrations (public registration)
CREATE POLICY "Anyone can register for alerts" 
ON public.user_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view their own registrations
CREATE POLICY "Users can view their own registrations" 
ON public.user_registrations 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_registrations_updated_at
  BEFORE UPDATE ON public.user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();