import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import HeaderLogo from "../../components/HeaderLogo";
import { updateUserProfile } from "@/services/apiService";
import Container from "@/components/Container";
import { LinearGradient } from "expo-linear-gradient";
import LocationIcon from "../../assets/images/icons/location.svg";

export default function LocationAccessScreen() {
  const [showSettingsButton, setShowSettingsButton] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      setShowSettingsButton(true);
    } else {
      requestLocation();
    }

    setShowSettingsButton(true);
  };

  const requestLocation = async () => {
    try {
      let locationData = await Location.getCurrentPositionAsync({});

      await storeLocation(locationData);

      router.push("/main/mainScreen");
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert("Error", "Failed to get location. Please try again.");
      setShowSettingsButton(true);
    }
  };

  const openSettings = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      Linking.openSettings();
    } else {
      requestLocation();
    }
  };

  const storeLocation = async (locationData: Location.LocationObject) => {
    try {
      await updateUserProfile({
        location: locationData,
        onboarding_step: "completed",
      });
      console.log("Location stored successfully");
    } catch (error) {
      console.error(
        "Error storing location:",
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert("Error", "Failed to store location. Please try again.");
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Text style={styles.title}>Allow your location</Text>
          <Text style={styles.subtitle}>
            We will need your location to give you better experience.
          </Text>
          <View style={styles.iconContainer}>
            <LocationIcon height={100} width={100} />
          </View>
          {showSettingsButton ? (
            <TouchableOpacity onPress={openSettings}>
              <LinearGradient
                colors={["#FF56F8", "#B6E300"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>OPEN SETTINGS</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={checkLocationPermission}>
              <LinearGradient
                colors={["#FF56F8", "#B6E300"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>ALLOW LOCATION ACCESS</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#313131",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#313131",
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: "center",
    paddingVertical: 16,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "#313131",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerLogoContainer: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  text: {
    color: "#313131",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  locationText: {
    color: "#313131",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
