import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMainContext } from "@/helpers/context/mainContext";
import SwipeProfile from "@/components/SwipeProfile";
import { useSharedValue } from "react-native-reanimated";
import InviteFriendsSvg from "../../../assets/images/icons/profile/inviteFriends.svg";

import ShareModal from "@/components/modals/ShareModal";
import BottomSheet, {
  BottomSheetRefProps,
} from "@/components/modals/BottomSheet";
interface ProfileScreenProps {
  topInset: number;
  bottomInset: number;
}

const ProfileScreen = ({ bottomInset }: ProfileScreenProps) => {
  const { userProfile } = useMainContext();

  const bottomSheetRef = useRef<BottomSheetRefProps>(null);

  const containerHeight = useSharedValue(100);

  // Callback to handle opening the bottom sheet
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.scrollTo(-200);
  }, []);

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <View style={styles.swipeProfileContainer}>
        <SwipeProfile
          profile={userProfile}
          isActivated={false}
          containerHeight={containerHeight}
          isEditEnabled={true}
        />
      </View>
      
      {/* <TouchableOpacity
        style={[styles.inviteButton]}
        onPress={handleOpenBottomSheet}
      >
        <LinearGradient
          colors={["#35A3F2", "#5E41FE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.inviteGradient}
        >
          <InviteFriendsSvg />
          <Text style={styles.inviteButtonText}>INVITE FRIENDS</Text>
        </LinearGradient>
      </TouchableOpacity> */}

      <BottomSheet ref={bottomSheetRef}>
        <View style={{ flex: 1, backgroundColor: "orange" }} />
      </BottomSheet>
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
  swipeProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    marginBottom: 12
  },
  inviteButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  inviteGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  inviteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
  },
});
