import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://exftzdxtyfbiwlpmecmd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnR6ZHh0eWZiaXdscG1lY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzNjA3NDgsImV4cCI6MjA0MDkzNjc0OH0.axNKBMWzNP3VWVvpKJ25m2sRIDCvRMj2bIG0VHtp2ME";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    storageKey: "jwtToken",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
