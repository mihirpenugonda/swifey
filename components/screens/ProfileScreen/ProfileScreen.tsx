import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AppBar from "../../../components/AppBar";
import { supabase } from "../../../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  name: string;
  date_of_birth: string;
  photos: string[] | null;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(jwtToken);
      if (userError || !user) {
        throw new Error("User not logged in or error fetching user.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, date_of_birth, photos")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
      }

      setProfile(data);

      if (data.photos && data.photos.length > 0) {
        let avatarPath = data.photos[0];

        if (avatarPath.startsWith("https://")) {
          setAvatarUrl(avatarPath);
        } else {
          const fullUrl = `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${avatarPath}`;
          console.log("Correct Avatar URL:", fullUrl);
          setAvatarUrl(fullUrl);
        }
      }
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const navigateToEditProfile = () => {
    router.push("/EditProfileScreen");
  };

  return (
    <>
      <AppBar />
      <View style={styles.container}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {profile && (
          <Text style={styles.profileName}>
            {profile.name}, {calculateAge(profile.date_of_birth)}
          </Text>
        )}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={navigateToEditProfile}
        >
          <LinearGradient
            colors={["#FF56F8", "#B6E300"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>EDIT PROFILE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  verificationButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
    elevation: 5,
  },
  verificationIcon: {
    width: 20,
    height: 20,
  },
  profileName: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 12,
  },
  buttonWrapper: {
    width: "80%",
    borderRadius: 30,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  placeholderAvatar: {
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666666",
    fontSize: 16,
  },
});
