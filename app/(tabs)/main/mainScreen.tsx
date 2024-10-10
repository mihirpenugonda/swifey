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
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                console.log("Play button pressed");
                setCurrentScreen("Play");
                if (lottieRef.current) {
                  lottieRef.current.play();
                }
              }}
              activeOpacity={0.7}
            >
              <LottieView
                ref={lottieRef}
                source={require("../../../assets/animations/dice.json")}
                style={styles.playIcon}
                loop={false}
                speed={2.5}
                autoPlay={false}
              />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabGroup}>
            <TabButton name="Kisses" icon={KissesIcon} />
            <TabButton name="Your Turn" icon={YourTurnIcon} />
          </View>
          <View style={styles.tabGroup}>
            <TabButton name="Bag" icon={BagIcon} />
            <TabButton name="Profile" icon={ProfileIcon} />
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
    gap: 48,
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
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 12,
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
    width: 64,
    height: 64,
    marginTop: -20,
  },
});
