import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jicclmljrvliapatuadl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2NsbWxqcnZsaWFwYXR1YWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3Nzc5MzAsImV4cCI6MjA0MDM1MzkzMH0.54f8YUqMqTsI1xjp0GEpYOAWBdxxxxvt-qFVFMqqtKc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
