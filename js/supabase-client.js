// Initialize Supabase Client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://dcigpxulclyeepepxthy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWdweHVsY2x5ZWVwZXB4dGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDc1NzMsImV4cCI6MjA5NzI4MzU3M30.a6EGv1I4G1HJI_nvN2dB3kzgxgWxX0boKcyaOGUs6To';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
