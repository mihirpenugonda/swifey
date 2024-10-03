import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuthenticatedUser, getAuthStatus } from "@/helpers/auth";

import Logo from "../../assets/images/newLogo.svg";
import { router } from "expo-router";

const HomeScreen: React.FC = () => {
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await getAuthStatus();

      if (authStatus.status) {
        const authenticatedUser = await getAuthenticatedUser();

        if (authenticatedUser.onboarding_step == "completed") {
          router.push("/main/mainScreen");
        } else {
          router.push("/NameInputScreen");
        }
      } else {
        router.push("/LoginScreen");
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <View style={styles.centeredContent}>
        <Logo height={100} width={100} />
        <ActivityIndicator size="small" color="#313131" style={styles.loader} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 40,
  },
});

export default HomeScreen;
