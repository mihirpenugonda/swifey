import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SvgLogo from "../../assets/images/logoText.svg";
import DynamicallySelectedPicker from "@/components/customPicker";
import { router } from "expo-router";

const KissKiss = require("../../assets/images/onboarding/kisskiss.png");
const RugKiss = require("../../assets/images/onboarding/rugkiss.png");
const KissRug = require("../../assets/images/onboarding/kissrug.png");
const RugRug = require("../../assets/images/onboarding/rugrug.png");

const OnboardingScreen: React.FC = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selected, setSelected] = useState("kisskiss");

  const handleNext = () => {
    router.push("/navigator/AppNavigator");
  };

  const selectedMap = [
    { value: 0, label: "😘 Kiss, 😘 Kiss", id: "kisskiss", image: KissKiss },
    { value: 1, label: "❌ Rug, 😘 Kiss", id: "rugkiss", image: RugKiss },
    { value: 2, label: "😘 Kiss, ❌ Rug", id: "kissrug", image: KissRug },
    { value: 3, label: "❌ Rug, ❌ Rug", id: "rugrug", image: RugRug },
  ];

  const logoHeight = 100;
  const imageAspectRatio = 1;
  const nextButtonHeight = 50;
  const verticalPadding = 105;

  const remainingHeight =
    screenHeight -
    (logoHeight +
      screenWidth / imageAspectRatio +
      nextButtonHeight +
      verticalPadding);

  const pickerHeight = remainingHeight * 1.1;

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgLogo width={100} height={100} style={styles.logo} />
      </View>

      <View style={styles.contentContainer}>
        <Image
          source={
            selectedMap.find(
              (item) => item.id.toLowerCase().replace(" ", "") === selected
            )?.image
          }
          style={styles.image}
        />

        <View style={styles.pickerContainer}>
          <DynamicallySelectedPicker
            items={selectedMap.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            width={screenWidth}
            height={pickerHeight}
            onScroll={(selected) => {
              const index = selected.index;
              if (index >= 0 && index < selectedMap.length) {
                setSelected(
                  selectedMap[index].id.toLowerCase().replace(" ", "")
                );
              }
            }}
            fontSize={16}
          />
        </View>

        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <LinearGradient
            colors={["#FF56F8", "#B6E300"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 25,
  },
  image: {
    width: "100%",
    height: "auto",
    resizeMode: "contain",
    aspectRatio: 1,
  },
  logo: {
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    height: "auto",
    marginHorizontal: -20,
  },
  nextButtonContainer: {
    width: "100%",
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#313131",
    fontSize: 16,
    fontWeight: "bold",
  },
});
