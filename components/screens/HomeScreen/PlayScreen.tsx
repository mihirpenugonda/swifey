import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { fetchProfiles, sendSwipe } from "../../../services/apiService";
import eventEmitter from "@/services/eventEmitter";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomModal } from "@/helpers/context/bottomModalContext";
import { useMainContext } from "@/helpers/context/mainContext";
import InsufficientPlaysModal from "@/components/modals/InsufficientPlaysModal";
import LottieView from "lottie-react-native";
import SwipeProfile from "@/components/SwipeProfile";

import KissCard from "../../../assets/images/icons/profile/kissCard.svg";
import RugCard from "../../../assets/images/icons/profile/rugCard.svg";

interface PlayScreenProps {
  topInset: number;
  bottomInset: number;
}

export default function PlayScreen({ topInset, bottomInset }: PlayScreenProps) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);
  const [selectedCard, setSelectedCard] = useState<"kiss" | "rug" | null>(null);

  const { showModal } = useBottomModal();
  const { setWalletBalance, walletBalance } = useMainContext();

  const [isActivated, setIsActivated] = useState(false);
  const profileHeight = useSharedValue(100);
  const buttonContainerHeight = useSharedValue(72);
  const buttonContainerOpacity = useSharedValue(1);
  const swiperContainerMarginBottom = useSharedValue(0);
  const cardContainerBottom = useSharedValue(0);

  const cardScale = useSharedValue(1);
  const cardTranslateX = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);
  const kissCardRotation = useSharedValue("7deg");
  const rugCardRotation = useSharedValue("-7deg");

  // Add these new shared values near the top of the component
  const rugCardOpacity = useSharedValue(1);
  const kissCardOpacity = useSharedValue(1);

  const preloadImages = async (profiles: any[]) => {
    if (profiles.length === 0) return;

    const imageUrls = profiles.flatMap((profile) =>
      profile.photos.map((photo: string) =>
        photo.startsWith("https://")
          ? photo
          : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${photo}`
      )
    );

    await Promise.all(imageUrls.map((url) => Image.prefetch(url)));
    console.log("All images preloaded");
  };

  const loadProfiles = async (is_refreshing: boolean = false) => {
    try {
      if (!is_refreshing) {
        setLoading(true);
      }

      const fetchedProfiles = await fetchProfiles(20, 0);
      console.log("Fetched profiles:", fetchedProfiles);

      if (Array.isArray(fetchedProfiles) && fetchedProfiles.length > 0) {
        setProfiles(fetchedProfiles);
        setAllSwiped(false);
        await preloadImages(fetchedProfiles);
      } else {
        console.error(
          "No profiles found or invalid response format:",
          fetchedProfiles
        );
        setProfiles([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching profiles:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length > 0 && currentProfileIndex < profiles.length) {
      console.log("Profile updated to:", profiles[currentProfileIndex]?.id);
    }
  }, [currentProfileIndex, profiles]);

  const handleSwipe = async (direction: "kiss" | "rug") => {
    const currentProfile = profiles[currentProfileIndex];

    try {
      setSelectedCard(direction);

      if (walletBalance === 0 && direction === "kiss") {
        showModal(<InsufficientPlaysModal />);
        return;
      }

      if (!currentProfile?.id) {
        console.error("Profile ID is missing");
        return;
      }

      const response = await sendSwipe(currentProfile.id, direction);

      if (response?.message === "You have already swiped on this profile") {
        console.log(
          `Already swiped on this profile. Past decision: ${response.past_decision}`
        );
        return;
      }

      processSwipeResponse(response);
      setWalletBalance(response.balance ?? 0);

      if (response.decision === "match") {
        eventEmitter.emit("matchMade");
      }

      setCurrentProfileIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= profiles.length) {
          setAllSwiped(true);
          return prevIndex;
        }
        return nextIndex;
      });

      setIsActivated(false);
    } catch (error) {
      console.error(`Error in handleSwipe (${direction}):`, error);

      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("insufficient balance")
      ) {
        showModal(<InsufficientPlaysModal />);
      }

      setAllSwiped(false);
    } finally {
      setSelectedCard(null);
    }
  };

  const processSwipeResponse = (response: {
    decision: string;
    match_id: any;
  }) => {
    const decisions = {
      match: "It's a match! Match ID",
      pending: "Swipe is pending",
      rugged: "Rugged!",
      profit: "Profit earned!",
      mutual_rug: "Mutual rug!",
    };

    console.log(
      decisions[response.decision as keyof typeof decisions] ||
        "Unknown decision",
      response.match_id
    );
  };

  const profileStyle = useAnimatedStyle(() => ({
    height: `${profileHeight.value}%`,
    marginBottom: swiperContainerMarginBottom.value,
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    height: buttonContainerHeight.value,
    opacity: buttonContainerOpacity.value,
    overflow: "hidden",
  }));

  const cardContainerStyle = useAnimatedStyle(() => ({
    bottom: cardContainerBottom.value,
  }));

  useEffect(() => {
    const animationConfig = {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    };

    if (isActivated) {
      buttonContainerHeight.value = withTiming(0, animationConfig);
      buttonContainerOpacity.value = withTiming(0, {
        ...animationConfig,
        duration: 150,
      });
      profileHeight.value = withTiming(100, animationConfig);
      swiperContainerMarginBottom.value = withTiming(0, animationConfig);
      cardContainerBottom.value = withTiming(80, animationConfig);
    } else {
      buttonContainerHeight.value = withTiming(64, {
        ...animationConfig,
        duration: 50,
      });
      buttonContainerOpacity.value = withTiming(1, animationConfig);
      profileHeight.value = withTiming(100, animationConfig);
      swiperContainerMarginBottom.value = withTiming(12, animationConfig);
      cardContainerBottom.value = withTiming(-300, {
        ...animationConfig,
        duration: 150,
      });
    }
  }, [isActivated]);

  const handleCardPress = async (card: "kiss" | "rug") => {
    setSelectedCard(card);

    const springConfig = {
      damping: 12,
      stiffness: 90,
    };

    cardScale.value = withSpring(1.5, springConfig);
    cardTranslateX.value = withSpring(card === "rug" ? 44 : -44, springConfig);
    cardTranslateY.value = withSpring(-100, springConfig);

    if (card === "rug") {
      rugCardRotation.value = withSpring("0deg", springConfig);
      rugCardOpacity.value = withSpring(1, springConfig);
      kissCardOpacity.value = withSpring(0.5, springConfig);
    } else {
      kissCardRotation.value = withSpring("0deg", springConfig);
      kissCardOpacity.value = withSpring(1, springConfig);
      rugCardOpacity.value = withSpring(0.5, springConfig);
    }

    await handleSwipe(card);

    await resetCardPosition();
    setIsActivated(false);
  };

  const resetCardPosition = async () => {
    const timingConfig = {
      duration: 200, // Adjust this value to control the speed of the animation
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    cardScale.value = withTiming(1, timingConfig);
    cardTranslateX.value = withTiming(0, timingConfig);
    cardTranslateY.value = withTiming(0, timingConfig);
    kissCardRotation.value = withTiming("7deg", timingConfig);
    rugCardRotation.value = withTiming("-7deg", timingConfig);
    kissCardOpacity.value = withTiming(1, timingConfig);
    rugCardOpacity.value = withTiming(1, timingConfig);

    await new Promise((resolve) => setTimeout(resolve, 200));

    runOnJS(setSelectedCard)(null);
  };

  const rugCardStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: rugCardRotation.value },
      { scale: selectedCard === "rug" ? cardScale.value : 1 },
      { translateX: selectedCard === "rug" ? cardTranslateX.value : 0 },
      { translateY: selectedCard === "rug" ? cardTranslateY.value : 0 },
    ],
    opacity: rugCardOpacity.value,
    zIndex: selectedCard === "rug" ? 2 : 1,
  }));

  const kissCardStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: kissCardRotation.value },
      { scale: selectedCard === "kiss" ? cardScale.value : 1 },
      { translateX: selectedCard === "kiss" ? cardTranslateX.value : 0 },
      { translateY: selectedCard === "kiss" ? cardTranslateY.value : 0 },
    ],
    opacity: kissCardOpacity.value,
    zIndex: selectedCard === "kiss" ? 2 : 1,
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LottieView
          source={require("../../../assets/animations/loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200, flex: 1 }}
          speed={2}
        />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <Animated.View style={[styles.swiperContainer, profileStyle]}>
        {allSwiped ? (
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>
              No profiles left to be swiped
            </Text>
          </View>
        ) : profiles.length > 0 ? (
          <SwipeProfile
            profile={profiles[currentProfileIndex]}
            isActivated={isActivated}
            setIsActivated={setIsActivated}
            containerHeight={profileHeight}
            currentClick={selectedCard}
            setCurrentClick={setSelectedCard}
          />
        ) : (
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>No profiles available</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, buttonContainerStyle]}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            if (selectedCard === null) {
              // Add this condition
              setCurrentProfileIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= profiles.length) {
                  setAllSwiped(true);
                  return prevIndex;
                }
                return nextIndex;
              });
            }
          }}
          disabled={selectedCard !== null} // Add this line
        >
          <Text style={[styles.buttonText]}>❌ Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsActivated(!isActivated)}
        >
          <Text style={styles.buttonText}>🎲 Play</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, cardContainerStyle]}>
        <TouchableOpacity
          onPress={() => handleCardPress("rug")}
          disabled={selectedCard !== null}
          style={{ zIndex: selectedCard === "rug" ? 2 : 1 }}
        >
          <Animated.View style={rugCardStyle}>
            <View style={styles.cardContent}>
              <RugCard style={styles.cardShadow} />
              {selectedCard === "rug" && (
                <View style={styles.cardOverlay}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCardPress("kiss")}
          disabled={selectedCard !== null}
          style={{ zIndex: selectedCard === "kiss" ? 2 : 1 }}
        >
          <Animated.View style={kissCardStyle}>
            <View style={styles.cardContent}>
              <KissCard style={styles.cardShadow} />
              {selectedCard === "kiss" && (
                <View style={styles.cardOverlay}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9F5",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  noProfilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProfilesText: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  button: {
    borderRadius: 9999,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#848282",
    borderStyle: "solid",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#313131",
    fontFamily: "Tomorrow_700Bold_Italic",
  },
  cardContainer: {
    flexDirection: "row",
    position: "absolute",
    width: "auto",
    left: 0,
    right: 0,
    paddingBottom: 0,
    justifyContent: "center",
    height: "auto",
  },

  cardContent: {
    position: "relative",
  },
  cardOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 11.77 },
    shadowOpacity: 0.25,
    shadowRadius: 12.86,
    elevation: 12,
  },
});
