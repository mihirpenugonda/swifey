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

import NumOfKiss from "../assets/images/numofkiss.svg";
import NumOfRug from "../assets/images/numofrug.svg";

interface SwipeProfileProps {
  profile: any;
  cardHeight: number;
  cardWidth: number;
}

const SwipeProfile: React.FC<SwipeProfileProps> = ({
  profile,
  cardHeight,
  cardWidth,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);

  useEffect(() => {
    if (profile?.photos) {
      setImageLoadingStates(new Array(profile.photos.length).fill(true));
    }
  }, [profile?.photos]);

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

  return (
    <View style={[styles.card, { height: cardHeight, width: cardWidth }]}>
      {imageLoadingStates[currentImageIndex] && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      <Image
        source={{
          uri: profile?.photos?.[currentImageIndex]?.startsWith("https://")
            ? profile?.photos?.[currentImageIndex]
            : `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${profile?.photos?.[currentImageIndex]}` ||
              "",
        }}
        style={styles.image}
        onLoad={() => handleImageLoad(currentImageIndex)}
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

      <View style={styles.profileInfoContainer}>
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

        {profile?.recent_swipes && (
          <View style={styles.last5PlaysContainer}>
            <Image
              source={require("../assets/images/icons/profile/last5PlaysText.png")}
              style={{
                width: 12,
                height: 80,
                resizeMode: "contain",
                marginRight: 6,
              }}
            />
            {profile?.recent_swipes?.map((swipe: any, index: number) => (
              <View
                key={`${swipe}-${index}`}
                style={{
                  backgroundColor: swipe == "kiss" ? "#9BFFD5" : "#FFD8CF",
                  borderRadius: 9999,
                  padding: 4,
                }}
              >
                <Text style={{ fontSize: 12 }}>
                  {swipe == "kiss" ? "😘" : "❌"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F4F9F5",
    borderWidth: 1,
    borderColor: "#313131",
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
    bottom: 40,
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
    justifyContent: "center"
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  activeImageIndicator: {
    backgroundColor: "#fff",
  },
});

export default SwipeProfile;
