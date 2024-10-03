import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useMainContext } from "@/helpers/context/mainContext";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

interface MatchItem {
  match_id: string;
  name: string;
  bio: string;
  age: number;
  photos: string[];
  is_verified: boolean;
}

export default function KissesScreen() {
  const router = useRouter();
  const { matches, loadMatches } = useMainContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, [loadMatches]);

  useEffect(() => {
    loadMatches();
  }, []);

  const handleMatchPress = (match: MatchItem) => {
    router.push({
      pathname: "/ChatScreen",
      params: {
        name: match.name,
        profileImage: match.photos[0],
        matchId: match.match_id,
      },
    });
  };

  const renderItem = ({ item }: { item: MatchItem }) => (
    <TouchableOpacity
      onPress={() => handleMatchPress(item)}
      style={styles.chatItem}
    >
      <View style={styles.avatarPlaceholder}>
        {item.photos.length > 0 ? (
          <Image source={{ uri: item.photos[0] }} style={styles.avatar} />
        ) : (
          <Text style={styles.placeholderText}>No Image</Text>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../../assets/images/your-move-placeholder.png")}
        style={styles.placeholderImage}
      />
      <Text style={styles.emptyStateText}>You don't have any kisses yet!</Text>
      <Text style={styles.subText}>Swipe people to get more kisses.</Text>
    </View>
  );

  if (!matches) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={styles.safeArea}>
          {matches.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={matches}
              renderItem={renderItem}
              keyExtractor={(item) => item.match_id}
              style={styles.list}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  safeArea: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#808080",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderText: {
    color: "#FFF",
    fontSize: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  placeholderImage: {
    width: 120,
    height: 140,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
});
