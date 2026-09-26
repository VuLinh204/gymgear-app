-- Run once in the Supabase SQL editor before deploying the booking form update.
-- The existing bookings table is created outside SUPABASE_SETUP.sql in some installs.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS preferred_time TIME;

COMMENT ON COLUMN public.bookings.preferred_time IS
  'Customer requested local appointment time. This is a request, not an availability confirmation.';
