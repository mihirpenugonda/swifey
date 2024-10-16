import {
  fetchUserWallet,
  fetchMatches,
  fetchMyTurnProfiles,
  fetchProfile,
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
import { getAuthenticatedUser, getAuthStatus } from "../auth";
import { Image } from "react-native";

interface MainContextType {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  refreshBalance: () => Promise<void>;

  matches: any[] | null;
  loadMatches: () => Promise<void>;
  yourTurnProfiles: any[] | null;
  loadYourTurnProfiles: () => Promise<void>;

  currentScreen: string;
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>;
  userProfile: any | null;
  fetchUserProfileDetails: () => Promise<void>;

  refreshAllData: () => Promise<void>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainScreenContext: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [yourTurnProfiles, setYourTurnProfiles] = useState<any[] | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("Play");
  const [userProfile, setUserProfile] = useState<any | null>(null);

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

  const fetchUserProfileDetails = async () => {
    try {
      const authenticatedUser = await getAuthenticatedUser();
      console.log("authenticatedUser here", authenticatedUser);
      const profileData = await fetchProfile(authenticatedUser.id);

      // Preload images
      if (profileData.photos && profileData.photos.length > 0) {
        const imageUrls = profileData.photos.map((photo: string) =>
          photo.startsWith("https://")
            ? photo
            : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${photo}`
        );

        await Promise.all(imageUrls.map((url: string) => Image.prefetch(url)));
        console.log("Profile images preloaded successfully");
      }

      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile details:", error);
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

  // Add this new function to refresh all data
  const refreshAllData = async () => {
    try {
      await Promise.all([
        refreshBalance(),
        loadMatches(),
        loadYourTurnProfiles(),
        fetchUserProfileDetails(),
      ]);
      console.log("All data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing all data:", error);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await getAuthStatus();

      if (authStatus.status) {
        refreshAllData(); // Use the new function here
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <MainContext.Provider
      value={{
        walletBalance,
        setWalletBalance,
        refreshBalance,
        matches,
        loadMatches,
        yourTurnProfiles,
        loadYourTurnProfiles,
        currentScreen,
        setCurrentScreen,
        userProfile,
        fetchUserProfileDetails,
        refreshAllData,
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
