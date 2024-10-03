import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import AppBar from "../../AppBar";
import BottomSheet from "@gorhom/bottom-sheet";
import { fetchProfiles, sendSwipe } from "../../../services/apiService";
import eventEmitter from "@/services/eventEmitter";
import { LinearGradient } from "expo-linear-gradient";

import NumOfKiss from "../../../assets/images/numofkiss.svg";
import NumOfRug from "../../../assets/images/numofrug.svg";
import { useBottomModal } from "@/helpers/context/bottomModalContext";

export default function PlayScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const swiperRef = useRef<Swiper<any>>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [allSwiped, setAllSwiped] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { showModal, hideModal } = useBottomModal();

  const loadProfiles = async (is_refreshing: boolean = false) => {
    try {
      if (!is_refreshing) setLoading(true);
      setError(null);

      const fetchedProfiles = await fetchProfiles(20, 0);
      console.log("Fetched profiles:", fetchedProfiles);

      if (Array.isArray(fetchedProfiles) && fetchedProfiles.length > 0) {
        setProfiles(fetchedProfiles);
        setAllSwiped(false); // Reset allSwiped when new profiles are loaded
      } else {
        console.error(
          "No profiles found or invalid response format:",
          fetchedProfiles
        );
        setError("No profiles found or invalid response format");
        setProfiles([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching profiles:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleSwipe = async (direction: "left" | "right") => {
    const currentProfile = profiles[currentProfileIndex];

    try {
      console.log(
        `Current Profile on ${direction === "left" ? "Rug" : "Kiss"} Swipe:`,
        currentProfile
      );
      console.log(`Current Profile Index: ${currentProfileIndex}`);

      if (!currentProfile?.id) {
        console.error("Profile ID is missing");
        return;
      }

      const swipeType = direction === "left" ? "rug" : "kiss";
      console.log(
        `Sending swipe request: ${swipeType} for profile ${currentProfile.id}`
      );

      const response = await sendSwipe(currentProfile.id, swipeType);

      console.log("Swipe API response:", response, response?.message);

      if (response?.message === "You have already swiped on this profile") {
        console.log(
          `Already swiped on this profile. Past decision: ${response.past_decision}`
        );

        return;
      }

      processSwipeResponse(response);

      if (swipeType === "kiss" && response.decision === "match") {
        console.log("Match made, emitting event");
        eventEmitter.emit("matchMade");
      }

      console.log(`Updating balance: ${response.balance}`);

      console.log(
        `Moving to next profile. Current index: ${currentProfileIndex}`
      );

      setCurrentProfileIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        console.log(`New profile index: ${nextIndex}`);
        if (nextIndex >= profiles.length) {
          setAllSwiped(true);
          return 0;
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

        console.log("HERE");

        showModal(
          <View
            style={{
              width: "100%",
              borderRadius: 15,
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Insufficient Balance
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              You don't have enough balance to perform this action. Please
              deposit to continue.
            </Text>
          </View>
        );
      }

      setProfiles((prevProfiles) => {
        const updatedProfiles = [
          currentProfile,
          ...prevProfiles.filter((p) => p.id !== currentProfile.id),
        ];
        console.log(
          `Added profile ${currentProfile?.id} back to the beginning of the profiles array`
        );
        return updatedProfiles;
      });

      // Reset the current profile index to show the added profile
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
    if (response.decision === "match") {
      console.log("It's a match! Match ID", response.match_id);
    } else if (response.decision === "pending") {
      console.log("Swipe is pending");
    } else if (response.decision === "rugged") {
      console.log("Rugged!");
    } else if (response.decision === "profit") {
      console.log("Profit earned!");
    } else if (response.decision === "mutual_rug") {
      console.log("Mutual rug!");
    }
  };

  const resetImageIndex = () => {
    setCurrentImageIndex(0);
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

  const handleImageTap = (direction: string) => {
    setCurrentImageIndex((prevIndex) => {
      const imagesLength = profiles[currentProfileIndex]?.photos?.length || 0;
      let newIndex = prevIndex;

      if (direction === "left" && prevIndex > 0) {
        newIndex = prevIndex - 1;
      } else if (direction === "right" && prevIndex < imagesLength - 1) {
        newIndex = newIndex + 1;
      }

      return newIndex;
    });
  };

  const handleBookButtonPress = () => {
    console.log("Book button pressed");
    setBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const renderBottomSheetContent = () => {
    const profile = profiles[currentProfileIndex];
    if (!profile) return null;

    return (
      <View style={styles.bottomSheetContainer}>
        <View style={styles.whiteContainer}>
          <Image
            source={{ uri: profile?.photos?.[0] || "" }}
            style={styles.bottomSheetImage}
            borderRadius={50}
          />
          <Text style={styles.bottomSheetName}>
            {profile?.name || "Unknown"},{" "}
            {profile?.date_of_birth
              ? calculateAge(profile.date_of_birth)
              : "N/A"}
          </Text>
          <View style={styles.verifiedContainer}>
            <Image
              source={require("../../../assets/images/verified-badge.png")}
              style={styles.verifiedIcon}
            />
            <Text style={styles.verifiedText}>
              {profile?.is_verified ? "Verified" : "Not Verified"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProfiles(true);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.swiperContainer}>
            {allSwiped ? (
              <View style={styles.noProfilesContainer}>
                <Text style={styles.noProfilesText}>
                  No profiles left to be swiped
                </Text>
              </View>
            ) : Array.isArray(profiles) && profiles.length > 0 ? (
              <Swiper
                ref={swiperRef}
                cards={profiles}
                renderCard={(profile) => (
                  <View
                    style={styles.card}
                    key={`${profile.id}-${currentImageIndex}`}
                  >
                    <Image
                      source={{
                        uri: profile?.photos?.[currentImageIndex] || "",
                      }}
                      style={styles.image}
                    />

                    <TouchableOpacity
                      style={styles.leftTapArea}
                      onPress={() => handleImageTap("left")}
                    />

                    <TouchableOpacity
                      style={styles.rightTapArea}
                      onPress={() => handleImageTap("right")}
                    />

                    <LinearGradient
                      colors={[
                        "rgba(134, 134, 134, 0.00)",
                        "rgba(0, 0, 0, 0.50)",
                        "rgba(0, 0, 0, 0.90)",
                      ]}
                      locations={[0.6908, 0.7869, 0.992]}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "100%", // Adjust this value as needed
                        width: "100%",
                      }}
                    />

                    <View style={styles.profileInfo}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.profileName}>
                          {profile?.name || "Unknown"},{" "}
                          {profile?.date_of_birth
                            ? calculateAge(profile.date_of_birth)
                            : "N/A"}
                        </Text>
                        <View style={styles.countContainer}>
                          <NumOfKiss width={20} height={20} />
                          <Text style={styles.countText}>
                            {profile?.num_of_kisses || 0}
                          </Text>
                        </View>
                        <View style={styles.countContainer}>
                          <NumOfRug width={20} height={20} />
                          <Text style={styles.countText}>
                            {profile?.num_of_rugs || 0}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.profileDescription}>
                        {profile?.bio || ""}
                      </Text>
                    </View>
                  </View>
                )}
                onSwipedLeft={handleSwipeLeft}
                onSwipedRight={handleSwipeRight}
                onSwipedAll={() => {
                  console.log("All cards swiped");
                  setAllSwiped(true);
                  setCurrentProfileIndex(0);
                }}
                cardIndex={currentProfileIndex}
                stackSize={3}
                backgroundColor={"transparent"}
                cardVerticalMargin={20}
                animateCardOpacity
                key={profiles.length} // Add this line to force re-render when profiles change
              />
            ) : (
              <View style={styles.noProfilesContainer}>
                <Text style={styles.noProfilesText}>No profiles available</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSwipeLeft}>
              <Text style={styles.buttonText}>❌</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSwipeRight}>
              <Text style={styles.buttonText}>😘</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["25%", "40%"]}
          index={-1}
          onChange={(index) => setBottomSheetOpen(index >= 0)}
          enablePanDownToClose
        >
          {renderBottomSheetContent()}
        </BottomSheet>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9F5",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  swiperContainer: {
    flex: 1,
    marginBottom: 25,
  },
  card: {
    height: "70%",
    borderRadius: 8,
    justifyContent: "center",
    backgroundColor: "#F4F9F5",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  leftTapArea: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
  },
  rightTapArea: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
  },
  bookButton: {
    position: "absolute",
    bottom: 150,
    left: 20,
    zIndex: 10,
  },
  bookIcon: {
    width: 30,
    height: 30,
  },
  profileInfo: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
  },
  profileName: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  profileDescription: {
    fontSize: 14,
    color: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: "#FF5A5F",
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  whiteContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  bottomSheetImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  bottomSheetName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: "red",
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
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 9999,
    gap: 2,
  },
  countText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#313131",
  },
});
