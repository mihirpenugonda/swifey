import React from "react";
import { View, StyleSheet } from "react-native";
import Logo from "../assets/images/logos/kissOrRugTextLogo.svg";

interface AppBarProps {
  showRightSide?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({ showRightSide = true }) => {
  return (
    <View style={styles.appBar}>
      <View style={styles.leftContainer}>
        <Logo height={60} style={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F9F5",
    paddingHorizontal: 16,
    width: "100%",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginRight: 8,
  },
  logoText: {
    color: "#000",
    fontSize: 18.65,
    fontFamily: "Tomorrow_700Regular",
    fontWeight: "400",
    lineHeight: 27.97,
    letterSpacing: -0.02 * 18.65,
    textAlign: "center",
  },
  bagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bagImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  usdText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Tomorrow_700Bold",
    fontWeight: "600",
    lineHeight: 17.4,
    textAlign: "left",
  },
});

export default AppBar;
