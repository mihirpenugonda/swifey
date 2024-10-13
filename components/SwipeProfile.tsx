import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Easing } from "react-native-reanimated";

import NumOfKiss from "../assets/images/numofkiss.svg";
import NumOfRug from "../assets/images/numofrug.svg";

import CrossSvg from "../assets/images/icons/profile/cross.svg";
import HeartSvg from "../assets/images/icons/profile/heart.svg";

interface SwipeProfileProps {
  profile: any;
  isActivated: boolean;
  containerHeight: Animated.SharedValue<number>;
  setIsActivated: React.Dispatch<React.SetStateAction<boolean>>;
  currentClick: "kiss" | "rug" | null;
  setCurrentClick: React.Dispatch<React.SetStateAction<"kiss" | "rug" | null>>;
}

const SwipeProfile: React.FC<SwipeProfileProps> = ({
  profile,
  isActivated,
  containerHeight,
  setIsActivated,
  currentClick,
  setCurrentClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const [isImageChanging, setIsImageChanging] = useState(false);

  const activationProgress = useSharedValue(0);
  const deactivateButtonScale = useSharedValue(0);
  const last5PlaysOpacity = useSharedValue(0);

  useEffect(() => {
    setCurrentImageIndex(0);
    if (profile?.photos) {
      setImageLoadingStates(new Array(profile.photos.length).fill(true));
    }
  }, [profile]);

  useEffect(() => {
    activationProgress.value = withTiming(isActivated ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    if (isActivated) {
      deactivateButtonScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      last5PlaysOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      deactivateButtonScale.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      last5PlaysOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isActivated]);

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

  const handleImageTap = (direction: "left" | "right") => {
    if (isImageChanging) return; // Prevent rapid tapping

    const imagesLength = profile?.photos?.length || 0;
    setCurrentImageIndex((prevIndex) => {
      let newIndex = prevIndex;
      if (direction === "left") {
        newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      } else if (direction === "right") {
        newIndex = prevIndex < imagesLength - 1 ? prevIndex + 1 : prevIndex;
      }

      if (newIndex !== prevIndex) {
        setIsImageChanging(true);
        setImageLoadingStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[newIndex] = true;
          return newStates;
        });
      }

      return newIndex;
    });
  };

  const handleImageLoad = (index: number) => {
    setImageLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
    setIsImageChanging(false);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: `${containerHeight.value}%`,
    };
  });

  const profileInfoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      activationProgress.value,
      [0, 1],
      [1, 0.2],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const deactivateButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: deactivateButtonScale.value }],
      opacity: deactivateButtonScale.value,
    };
  });

  const last5PlaysContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: last5PlaysOpacity.value,
    };
  });

  const handleDeactivate = () => {
    if (currentClick === null) {
      setIsActivated(false);
    }
  };

  return (
    <Animated.View style={[styles.card, containerStyle]}>
      <Image
        source={{
          uri: profile?.photos?.[currentImageIndex]?.startsWith("https://")
            ? profile?.photos?.[currentImageIndex]
            : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${profile?.photos?.[currentImageIndex]}` ||
              "",
        }}
        style={styles.image}
        onLoad={() => handleImageLoad(currentImageIndex)}
        onError={() => handleImageLoad(currentImageIndex)}
      />

      {imageLoadingStates[currentImageIndex] && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <TouchableOpacity
        style={styles.leftTapArea}
        onPress={() => handleImageTap("left")}
        activeOpacity={1}
      />
      <TouchableOpacity
        style={styles.rightTapArea}
        onPress={() => handleImageTap("right")}
        activeOpacity={1}
      />

      <LinearGradient
        colors={[
          "rgba(134, 134, 134, 0.00)",
          "rgba(0, 0, 0, 0.50)",
          "rgba(0, 0, 0, 0.90)",
        ]}
        locations={[0.6908, 0.7869, 0.992]}
        style={styles.gradient}
      />

      <Animated.View style={[styles.profileInfoContainer, profileInfoStyle]}>
        <View style={styles.profileInfo}>
          <View style={styles.profileInfoInner}>
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>
                {profile?.name || "Unknown"},{" "}
                {profile?.date_of_birth
                  ? calculateAge(profile.date_of_birth)
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.countsContainer}>
              <View style={styles.countContainer}>
                <NumOfKiss width={18} height={18} />
                <Text style={styles.countText}>
                  {profile?.num_of_kisses_sent || 0}
                </Text>
              </View>
              <View style={styles.countContainer}>
                <NumOfRug width={18} height={18} />
                <Text style={styles.countText}>
                  {profile?.num_of_kisses_received || 0}
                </Text>
              </View>
            </View>
          </View>
          {profile?.bio && (
            <Text style={styles.profileDescription}>{profile?.bio || ""}</Text>
          )}
        </View>
      </Animated.View>

      {profile?.photos && profile.photos.length > 1 && (
        <View style={styles.imageIndicatorContainer}>
          {profile.photos.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.imageIndicator,
                index === currentImageIndex && styles.activeImageIndicator,
              ]}
            />
          ))}
        </View>
      )}

      {isActivated && (
        <View style={styles.bottomContainer}>
          <Animated.View
            style={[styles.last5PlaysContainer, last5PlaysContainerStyle]}
          >
            <View style={{ flexDirection: "row", gap: 2 }}>
              {profile?.recent_swipes?.length > 0 ? (
                profile.recent_swipes.map((swipe: any, index: number) => (
                  <View key={`${swipe}-${index}`}>
                    {swipe === "kiss" ? (
                      <HeartSvg width={24} height={24} />
                    ) : (
                      <CrossSvg width={24} height={24} />
                    )}
                  </View>
                ))
              ) : (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#ffffff",
                  }}
                />
              )}
            </View>
            <Text style={{ color: "#ffffff" }}>
              {!profile?.recent_swipes
                ? "Zero Plays"
                : profile.recent_swipes.length === 0
                ? "Zero Plays"
                : profile.recent_swipes.length === 1
                ? `${profile?.name || ""}'s Last Play`
                : `${profile?.name || ""}'s Last ${
                    profile.recent_swipes.length
                  } ⚡`}
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              deactivateButtonStyle,
              {
                position: "absolute",
                right: 10,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.deactivateButton,
                currentClick !== null && styles.disabledDeactivateButton,
              ]}
              onPress={handleDeactivate}
              activeOpacity={0.8}
              disabled={currentClick !== null}
            >
              <Text style={styles.deactivateButtonText}>❌</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F4F9F5",
    borderWidth: 1,
    borderColor: "#313131",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 3,
  },
  leftTapArea: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 100,
  },
  rightTapArea: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 100,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  profileInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  profileInfo: {
    flex: 1,
  },
  last5PlaysContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  profileInfoInner: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  countsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  countText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#313131",
  },
  profileDescription: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 6,
  },
  imageIndicatorContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 4,
  },
  imageIndicator: {
    width: "100%",
    height: 4,
    backgroundColor: "#D9D9D9", // Inactive color
    marginHorizontal: 2,
    flex: 1,
    borderRadius: 2,
  },
  activeImageIndicator: {
    backgroundColor: "#F8D000", // Active color
  },
  bottomContainer: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 10,
  },
  deactivateButton: {
    backgroundColor: "#B7B7B7",
    borderRadius: 9999,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10000,
  },
  deactivateButtonText: {
    fontSize: 20,
  },
  disabledDeactivateButton: {
    opacity: 0.5,
  },
});

export default SwipeProfile;
