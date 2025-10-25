import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);
