import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

import { useBottomModal } from "@/helpers/context/bottomModalContext";
import { useMainContext } from "@/helpers/context/mainContext";

import BuyPlaysModal from "@/components/modals/BuyPlaysModal";

import TrophySvg from "../../../assets/images/icons/trophyIcon.svg";

export default function BagScreen() {
  const { showModal } = useBottomModal();
  const { walletBalance, refreshBalance } = useMainContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  }, [refreshBalance]);

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.contentContainer}>
          <View style={styles.bonusContainer}>
            <TrophySvg />
            <Text style={[styles.bonusText, { fontWeight: "bold" }]}>
              $0 Total Bonus
            </Text>
          </View>

          <Text style={styles.playsText}>Total Plays Remaining</Text>

          <Text style={styles.playsCount}>{walletBalance}</Text>

          <LinearGradient
            colors={["#FF56F8", "#B6E300"]}
            start={{ x: -0.1338, y: 0 }}
            end={{ x: 1.0774, y: 0 }}
            style={styles.buyPlaysButton}
          >
            <TouchableOpacity
              style={styles.buyPlaysButtonTouchable}
              onPress={() => {
                showModal(<BuyPlaysModal />);
              }}
            >
              <Text style={styles.buyPlaysButtonText}>BUY PLAYS</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* <TouchableOpacity>
            <Text style={styles.transactionHistoryText}>
              View Transaction History
            </Text>
          </TouchableOpacity> */}
          {/* 
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryItem}>🏆 You won 12 times</Text>
            <Text style={styles.summaryItem}>❌ You lost 6 times</Text>
            <Text style={styles.summaryItem}>⏳ 35 plays pending on others</Text>
          </View> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9F5",
    paddingBottom: 0,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  contentContainer: {
    backgroundColor: "#0000001A",
    padding: 20,
    borderRadius: 24,
    width: "100%",
    gap: 5,
  },
  bonusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bonusText: {
    fontFamily: "Tomorrow_700Bold",
    color: "#00581B",
    marginLeft: 10,
  },
  playsText: {
    fontFamily: "Tomorrow_400Regular",
    marginBottom: 5,
  },
  playsCount: {
    fontFamily: "Tomorrow_700Bold",
    fontSize: 24,
    color: "#C30075",
    marginBottom: 10,
  },
  buyPlaysButton: {
    borderRadius: 20,
    marginBottom: 10,
  },
  buyPlaysButtonTouchable: {
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  buyPlaysButtonText: {
    color: "#313131",
    fontWeight: "bold",
  },
  transactionHistoryText: {
    fontFamily: "Tomorrow_400Regular",
    color: "blue",
    textDecorationLine: "underline",
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryTitle: {
    fontFamily: "Tomorrow_700Bold",
    fontWeight: "bold",
    marginBottom: 5,
  },
  summaryItem: {
    fontFamily: "Tomorrow_400Regular",
    marginBottom: 5,
  },
});
