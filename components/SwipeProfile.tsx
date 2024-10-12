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
  Extrapolate,
} from "react-native-reanimated";
import { Easing } from "react-native-reanimated";

import NumOfKiss from "../assets/images/numofkiss.svg";
import NumOfRug from "../assets/images/numofrug.svg";

interface SwipeProfileProps {
  profile: any;
  isActivated: boolean;
  containerHeight: Animated.SharedValue<number>;
  setIsActivated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwipeProfile: React.FC<SwipeProfileProps> = ({
  profile,
  isActivated,
  containerHeight,
  setIsActivated,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);

  const activationProgress = useSharedValue(0);
  const deactivateButtonScale = useSharedValue(0);

  // Add this new useEffect hook to reset currentImageIndex when profile changes
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
    } else {
      deactivateButtonScale.value = withTiming(0, {
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
    setCurrentImageIndex((prevIndex) => {
      const imagesLength = profile?.photos?.length || 0;
      if (direction === "left" && prevIndex > 0) {
        return prevIndex - 1;
      } else if (direction === "right" && prevIndex < imagesLength - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const handleImageLoad = (index: number) => {
    setImageLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
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
      [1, 0.5],
      Extrapolate.CLAMP
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
        onError={() => handleImageLoad(currentImageIndex)} // Add this line to handle load errors
      />

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

      <View style={styles.imageIndicatorContainer}>
        {profile?.photos?.map((_: any, index: number) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              index === currentImageIndex && styles.activeImageIndicator,
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.deactivateButton, deactivateButtonStyle]}>
        <TouchableOpacity onPress={() => setIsActivated(false)}>
          <Text style={styles.deactivateButtonText}>❌</Text>
        </TouchableOpacity>
      </Animated.View>
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
    zIndex: 1,
  },
  rightTapArea: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
  },
  profileInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  profileInfo: {
    flex: 1,
  },
  last5PlaysContainer: {
    gap: 6,
    alignItems: "flex-end",
    justifyContent: "center",
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
    zIndex: 2,
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
  deactivateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deactivateButtonText: {
    fontSize: 20,
  },
});

export default SwipeProfile;
