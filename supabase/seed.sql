-- Seed initial SaaS Channels and Profiles for Realtime Database
INSERT INTO public.channels (id, name, description, is_private)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'general', 'Company-wide announcements and general discussion', false),
  ('22222222-2222-2222-2222-222222222222', 'engineering', 'Real-time WebSocket & Next.js architecture discussions', false),
  ('33333333-3333-3333-3333-333333333333', 'security-e2ee', 'Signal protocol audit & safety key verification', false)
ON CONFLICT (name) DO NOTHING;
