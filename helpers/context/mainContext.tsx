import {
  fetchUserWallet,
  fetchMatches,
  fetchMyTurnProfiles,
} from "@/services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getAuthenticatedUser } from "../auth";
import { supabase } from "@/supabaseClient";

interface MainContextType {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  refreshBalance: () => Promise<void>;
  profileDetails: any;
  fetchUserProfile: () => Promise<void>;
  matches: any[] | null;
  loadMatches: () => Promise<void>;
  yourTurnProfiles: any[] | null;
  loadYourTurnProfiles: () => Promise<void>;

  currentScreen: string;
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainScreenContext: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [profileDetails, setProfileDetails] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [yourTurnProfiles, setYourTurnProfiles] = useState<any[] | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("Home");

  const refreshBalance = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        router.navigate("/EmailScreen");
        return;
      }

      const wallet = await fetchUserWallet(userId);
      setWalletBalance(wallet.balance);
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const authenticatedUser = await getAuthenticatedUser();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authenticatedUser.id)
        .single();

      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
      }

      let image;

      if (data.photos && data.photos.length > 0) {
        let avatarPath = data.photos[0];

        if (avatarPath.startsWith("https://")) {
          image = avatarPath;
        } else {
          const fullUrl = `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${avatarPath}`;
          image = fullUrl;
        }
      }

      setProfileDetails({
        name: data.name,
        date_of_birth: data.date_of_birth,
        image: image,
      });
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  const loadMatches = async () => {
    try {
      const fetchedMatches = await fetchMatches(20, 0);
      setMatches(fetchedMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    }
  };

  const loadYourTurnProfiles = async () => {
    try {
      const profiles = await fetchMyTurnProfiles(20, 0);
      const formattedProfiles = profiles.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        imageUri: profile.photos.length > 0 ? profile.photos[0] : undefined,
      }));
      setYourTurnProfiles(formattedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    refreshBalance();
    fetchUserProfile();
    loadMatches();
    loadYourTurnProfiles();
  }, []);

  return (
    <MainContext.Provider
      value={{
        walletBalance,
        setWalletBalance,
        refreshBalance,
        profileDetails,
        fetchUserProfile,
        matches,
        loadMatches,
        yourTurnProfiles,
        loadYourTurnProfiles,
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = (): MainContextType => {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useMain must be used within a MainProvider");
  }
  return context;
};
