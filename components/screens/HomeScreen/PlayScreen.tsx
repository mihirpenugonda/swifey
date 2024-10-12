import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Swiper from "react-native-deck-swiper";
import { fetchProfiles, sendSwipe } from "../../../services/apiService";
import eventEmitter from "@/services/eventEmitter";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomModal } from "@/helpers/context/bottomModalContext";
import { useMainContext } from "@/helpers/context/mainContext";
import InsufficientPlaysModal from "@/components/modals/InsufficientPlaysModal";
import LottieView from "lottie-react-native";
import SwipeProfile from "@/components/SwipeProfile";

interface PlayScreenProps {
  topInset: number;
  bottomInset: number;
}

export default function PlayScreen({ topInset, bottomInset }: PlayScreenProps) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);
  const [firstProfileImagesLoaded, setFirstProfileImagesLoaded] =
    useState(false);

  const [isActivated, setIsActivated] = useState(false);
  const profileHeight = useSharedValue(100);
  const buttonContainerHeight = useSharedValue(72);
  const buttonContainerOpacity = useSharedValue(1);
  const swiperContainerMarginBottom = useSharedValue(0);

  const swiperRef = useRef<Swiper<any>>(null);
  const { showModal } = useBottomModal();
  const { setWalletBalance, walletBalance } = useMainContext();

  const preloadImages = async (profiles: any[]) => {
    if (profiles.length === 0) return;

    const firstProfileImages = profiles[0].photos.map((photo: string) =>
      photo.startsWith("https://")
        ? photo
        : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${photo}`
    );

    try {
      await Promise.all(
        firstProfileImages.map((url: string) => Image.prefetch(url))
      );
      setFirstProfileImagesLoaded(true);
    } catch (error) {
      console.error("Error preloading images:", error);
      setFirstProfileImagesLoaded(true);
    }

    const remainingImageUrls = profiles
      .slice(1)
      .flatMap((profile) =>
        profile.photos.map((photo: string) =>
          photo.startsWith("https://")
            ? photo
            : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${photo}`
        )
      );

    await Promise.all(remainingImageUrls.map((url) => Image.prefetch(url)));
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

  const handleSwipe = async (
    direction: "left" | "right",
    is_button_press: boolean = false
  ) => {
    const currentProfile = profiles[currentProfileIndex];

    try {
      console.log(
        `Current Profile on ${direction === "left" ? "Rug" : "Kiss"} Swipe:`,
        currentProfile
      );
      console.log(`Current Profile Index: ${currentProfileIndex}`);

      if (walletBalance === 0 && direction === "right") {
        showModal(<InsufficientPlaysModal />);
        return;
      }

      if (!currentProfile?.id) {
        console.error("Profile ID is missing");
        return;
      }

      const swipeType = direction === "left" ? "rug" : "kiss";
      console.log(
        `Sending swipe request: ${swipeType} for profile ${currentProfile.id}`
      );

      if (is_button_press) {
        swiperRef?.current?.[
          swipeType === "rug" ? "swipeLeft" : "swipeRight"
        ]();
      }

      // Only send the swipe to the API if it's a "kiss" (right swipe)
      if (swipeType === "kiss") {
        const response = await sendSwipe(currentProfile.id, swipeType);

        console.log("Swipe API response:", response, response?.message);

        if (response?.message === "You have already swiped on this profile") {
          console.log(
            `Already swiped on this profile. Past decision: ${response.past_decision}`
          );
          return;
        }

        processSwipeResponse(response);

        setWalletBalance(response.balance ?? 0);

        if (response.decision === "match") {
          console.log("Match made, emitting event");
          eventEmitter.emit("matchMade");
        }

        console.log(`Updating balance: ${response.balance}`);
      }

      console.log(
        `Moving to next profile. Current index: ${currentProfileIndex}`
      );

      setCurrentProfileIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        console.log(`New profile index: ${nextIndex}`);
        if (nextIndex >= profiles.length) {
          setAllSwiped(true);
          return prevIndex;
        }
        return nextIndex;
      });
    } catch (error) {
      console.error(`Error in handleSwipe (${direction}):`, error);

      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("insufficient balance")
      ) {
        console.log("Not enough balance, opening insufficient balance modal");
        showModal(<InsufficientPlaysModal />);
        swiperRef?.current?.swipeBack();
      }

      setCurrentProfileIndex(0);
      setAllSwiped(false);
    }
  };

  const handleSwipeLeft = () => handleSwipe("left");
  const handleSwipeRight = () => handleSwipe("right");

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

  const profileStyle = useAnimatedStyle(() => {
    return {
      height: `${profileHeight.value}%`,
      marginBottom: swiperContainerMarginBottom.value,
    };
  });

  const buttonContainerStyle = useAnimatedStyle(() => {
    return {
      height: buttonContainerHeight.value,
      opacity: buttonContainerOpacity.value,
      overflow: "hidden",
    };
  });

  useEffect(() => {
    if (isActivated) {
      buttonContainerHeight.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      buttonContainerOpacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      });
      profileHeight.value = withTiming(100, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      swiperContainerMarginBottom.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      buttonContainerHeight.value = withTiming(64, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      buttonContainerOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      profileHeight.value = withTiming(100, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      swiperContainerMarginBottom.value = withTiming(12, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isActivated]);

  if (loading || !firstProfileImagesLoaded) {
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
          />
        ) : (
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>No profiles available</Text>
          </View>
        )}
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, buttonContainerStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCurrentProfileIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              console.log(`New profile index: ${nextIndex}`);
              if (nextIndex >= profiles.length) {
                setAllSwiped(true);
                return prevIndex;
              }
              return nextIndex;
            });
          }}
        >
          <Text style={styles.buttonText}>❌ Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsActivated(!isActivated)}
        >
          <Text style={styles.buttonText}>🎲 Play</Text>
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
});
