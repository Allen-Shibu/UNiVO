import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://univo.jiobase.com';
const supabaseKey = "sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_";

export const supabase = createClient(supabaseUrl, supabaseKey);

// "https://opzechnwukuqfvfaytfx.supabase.co"