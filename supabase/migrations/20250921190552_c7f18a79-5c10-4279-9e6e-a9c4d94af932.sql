-- CRITICAL SECURITY FIX: Remove the dangerous SELECT policy that allows public access to all user data
-- This policy currently has 'true' as the condition which allows anyone to read all sensitive user information
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.user_registrations;

-- The table now has only the INSERT policy for registrations
-- No SELECT access until proper authentication is implemented