import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://opzechnwukuqfvfaytfx.supabase.co";
const supabaseKey = "sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

