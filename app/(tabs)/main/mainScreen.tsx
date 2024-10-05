import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

  const renderScreen = () => {
    switch (currentScreen) {
      case "Kisses":
        return <KissesScreen />;
      case "Your Turn":
        return <YourMoveScreen />;
      case "Play":
        return <HomeScreen />;
      case "Bag":
        return <BagScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const TabButton = ({ name, icon }: { name: string; icon: any }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        currentScreen === name && styles.activeTabButton,
      ]}
      onPress={() => setCurrentScreen(name)}
    >
      <Image source={icon} style={[styles.tabIcon]} />
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
          <TabButton name="Play" icon={PlayIcon} />
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
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  playIcon: {
    width: 40,
    height: 40,
    marginBottom: 0,
  },
  activeTabIcon: {
    tintColor: "#CDFF8B",
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 10,
  },
  activeTabText: {
    color: "#CDFF8B",
  },
});
