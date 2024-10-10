import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AppBar from "../../../components/AppBar";
import { supabase } from "../../../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMainContext } from "@/helpers/context/mainContext";

interface ProfileScreenProps {
  topInset: number;
  bottomInset: number;
}

const ProfileScreen = ({ topInset, bottomInset }: ProfileScreenProps) => {
  const router = useRouter();

  const { profileDetails } = useMainContext();

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
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      {profileDetails ? (
        <Image source={{ uri: profileDetails.image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {profileDetails && (
        <Text style={styles.profileName}>
          {profileDetails.name}, {calculateAge(profileDetails.date_of_birth)}
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
    </LinearGradient>
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
