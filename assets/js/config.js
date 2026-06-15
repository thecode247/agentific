/* ===========================================================
   Agentific — runtime config
   Fill these in with your Supabase project values, then leads
   from the contact form are saved straight into your database.

   Find them in: Supabase Dashboard → Project Settings → API
   - SUPABASE_URL      = "Project URL"
   - SUPABASE_ANON_KEY = "anon / public" key  (safe to ship in the browser)

   The anon key is meant to be public. Security comes from the
   Row-Level-Security policy in supabase/migrations/0001_leads.sql,
   which lets visitors INSERT leads but never read them.
   =========================================================== */
window.AGENTIFIC_CONFIG = {
  SUPABASE_URL: "",       // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: ""   // e.g. "eyJhbGciOi..."
};
