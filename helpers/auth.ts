import { supabase } from "@/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthStatus = async () => {
  const jwtToken = await AsyncStorage.getItem("jwtToken");

  if (jwtToken) {
    const {
      data: { user },
    } = await supabase.auth.getUser(jwtToken);

    if (user) {
      return {
        user,
        status: true,
      };
    }
  }

  return {
    user: null,
    status: false,
  };
};

export const getAuthenticatedUser = async () => {
  const authStatus = await getAuthStatus();

  if (!authStatus.status || !authStatus.user) {
    throw new Error("user not logged in.");
  }

  const { data: userData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authStatus.user.id)
    .single();

  if (error) {
    throw new Error(`Error fetching user data: ${error.message}`);
  }

  return userData;
};
