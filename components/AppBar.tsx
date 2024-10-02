import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { fetchUserWallet } from "../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../assets/images/newLogo.svg";

interface AppBarProps {
  showRightSide?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({ showRightSide = true }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const walletData = await fetchUserWallet(userId);
        const solBalance = walletData.balance.toFixed(2);
        setBalance(`${solBalance} USD`);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setBalance("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <View style={styles.appBar}>
      <View style={styles.leftContainer}>
        <Logo width={40} height={40} style={styles.logo} />
        <Text style={styles.logoText}>KISS or RUG</Text>
      </View>

      {showRightSide && (
        <View style={styles.bagContainer}>
          <Image
            source={require("../assets/images/bag.png")}
            style={styles.bagImage}
          />
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.usdText}>
              {balance ? balance : "Loading..."}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F4F9F5",
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
