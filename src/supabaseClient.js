import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tlrmpvnxxaxpvwnmmgtg.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscm1wdm54eGF4cHZ3bm1tZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Nzg3ODMsImV4cCI6MjA3NzU1NDc4M30.U3GoeaeGmaJuUT8MZlAjL0TCs-oFs-_B2NTpOxIfPjg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
