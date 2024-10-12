import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

import AppBar from "../../../components/AppBar";
import HomeScreen from "../../../components/screens/HomeScreen/PlayScreen";
import KissesScreen from "../../../components/screens/KissesScreen/KissesScreen";
import YourMoveScreen from "../../../components/screens/YourMove/YourMoveScreen";
import BagScreen from "../../../components/screens/BagScreen/BagScreen";
import ProfileScreen from "../../../components/screens/ProfileScreen/ProfileScreen";
import {
  BottomModalProvider,
  useBottomModal,
} from "@/helpers/context/bottomModalContext";
import BottomModal from "@/components/modals/BottomModal";
import {
  MainScreenContext,
  useMainContext,
} from "@/helpers/context/mainContext";

const KissesIcon = require("../../../assets/images/kisses.png");
const YourTurnIcon = require("../../../assets/images/yourmove.png");
const PlayIcon = require("../../../assets/images/play.png");
const BagIcon = require("../../../assets/images/bag.png");
const ProfileIcon = require("../../../assets/images/profile.png");

function MainScreenContent() {
  const insets = useSafeAreaInsets();

  const { isVisible, hideModal, modalContent } = useBottomModal();
  const { currentScreen, setCurrentScreen } = useMainContext();
  const lottieRef = useRef<LottieView>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case "Kisses":
        return (
          <KissesScreen topInset={insets.top} bottomInset={insets.bottom} />
        );
      case "Your Turn":
        return (
          <YourMoveScreen topInset={insets.top} bottomInset={insets.bottom} />
        );
      case "Play":
        return <HomeScreen topInset={insets.top} bottomInset={insets.bottom} />;
      case "Bag":
        return <BagScreen topInset={insets.top} bottomInset={insets.bottom} />;
      case "Profile":
        return (
          <ProfileScreen topInset={insets.top} bottomInset={insets.bottom} />
        );
      default:
        return <HomeScreen topInset={insets.top} bottomInset={insets.bottom} />;
    }
  };

  const TabButton = ({ name, icon }: { name: string; icon: any }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        currentScreen === name && styles.activeTabButton,
      ]}
      onPress={() => {
        console.log("Button pressed:", name);
        setCurrentScreen(name);
      }}
      activeOpacity={0.7}
    >
      <Image source={icon} style={styles.tabIcon} />
      <Text
        style={[styles.tabText, currentScreen === name && styles.activeTabText]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaProvider>
        <View style={{ paddingTop: insets.top }}>
          <AppBar />
        </View>
        <View style={styles.content}>{renderScreen()}</View>
        <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
          <TabButton name="Kisses" icon={KissesIcon} />
          <TabButton name="Your Turn" icon={YourTurnIcon} />
          <TabButton name="Home" icon={PlayIcon} />
          <TabButton name="Bag" icon={BagIcon} />
          <TabButton name="Profile" icon={ProfileIcon} />
        </View>
      </SafeAreaProvider>

      <BottomModal visible={isVisible} onClose={hideModal}>
        {modalContent}
      </BottomModal>
    </>
  );
}

export default function MainScreen() {
  return (
    <MainScreenContext>
      <BottomModalProvider>
        <MainScreenContent />
      </BottomModalProvider>
    </MainScreenContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F5",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#000000",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  tabGroup: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabIcon: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 10,
  },
  activeTabText: {
    color: "#CDFF8B",
  },
  playButtonContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  playButton: {
    width: "auto",
    height: "auto",
    borderRadius: 9999,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FF62EF33",
    borderStyle: "solid",
    padding: 8,
    gap: 4,
  },
  playButtonText: {
    color: "#CDFF8B",
    fontSize: 14,
    fontFamily: "Tomorrow_700Bold_Italic",
    fontStyle: "italic",
  },
  playIcon: {
    width: 58,
    height: 58,
    marginTop: -20,
  },
});
