/* js/supabase-client.js
   Shared Supabase client for every FrozenShop page.
   Exposes a single instance as `window.sb` (NOT `window.supabase`) so it
   never collides with the Supabase SDK's own global namespace. Safe to
   include this script tag on every page — it guards against being
   initialized twice. */
(function () {
  if (window.sb) return; // duplicate-inclusion guard
  const SUPABASE_URL = 'https://ufmzgobtjtetrxvewvxl.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_DEZTCSDOUIcSzs_t0tOAqA_HVOdy8As';
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase SDK not found. Make sure the @supabase/supabase-js CDN script loads before js/supabase-client.js.');
    return;
  }
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
})();
