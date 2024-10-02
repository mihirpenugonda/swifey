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

const HomeIcon = require("../../../assets/images/play.png");
const KissesIcon = require("../../../assets/images/kisses.png");
const YourMoveIcon = require("../../../assets/images/yourmove.png");
const BagIcon = require("../../../assets/images/bag.png");
const ProfileIcon = require("../../../assets/images/profile.png");

function MainScreenContent() {
  const [activeTab, setActiveTab] = React.useState("Home");
  const insets = useSafeAreaInsets();
  const { isVisible, hideModal, modalContent } = useBottomModal();

  const renderScreen = () => {
    switch (activeTab) {
      case "Kisses":
        return <KissesScreen />;
      case "Your Move":
        return <YourMoveScreen />;
      case "Home":
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
      style={[styles.tabButton, activeTab === name && styles.activeTabButton]}
      onPress={() => setActiveTab(name)}
    >
      <Image source={icon} style={[styles.tabIcon]} />
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
          <TabButton name="Your Move" icon={YourMoveIcon} />
          <TabButton name="Home" icon={HomeIcon} />
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
    <BottomModalProvider>
      <MainScreenContent />
    </BottomModalProvider>
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
    paddingTop: 12,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "rgba(205, 255, 139, 0.2)",
  },
  tabIcon: {
    width: 36,
    height: 36,
  },
  activeTabIcon: {
    tintColor: "#CDFF8B",
  },
});
