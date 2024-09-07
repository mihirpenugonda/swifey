import React, { useEffect, useState } from 'react';
import { Image, View, Text, FlatList, StyleSheet, SafeAreaView, ListRenderItem, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from '../../AppBar';
import { fetchMatches } from '../../../services/apiService'; // Import the fetchMatches function

interface MatchItem {
  match_id: string;
  name: string;
  bio: string;
  age: number;
  photos: string[];
  is_verified: boolean;
}

export default function KissesScreen() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
   const router = useRouter();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const fetchedMatches = await fetchMatches(20, 0); // Fetch 20 matches starting from offset 0
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const handleMatchPress = (match: MatchItem) => {
    router.push({
      pathname: '/ChatScreen',
      params: {
        name: match.name,
        profileImage: match.photos[0],
        matchId: match.match_id,
      },
    });
  };

  const renderItem = ({ item }: { item: MatchItem }) => (
    <TouchableOpacity onPress={() => handleMatchPress(item)} style={styles.chatItem}>
      <View style={styles.avatarPlaceholder}>
        {item.photos.length > 0 ? (
          <Image source={{ uri: item.photos[0] }} style={styles.avatar} />
        ) : (
          <Text style={styles.placeholderText}>No Image</Text>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.bio || 'No bio available'}</Text>
      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={(item) => item.match_id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#808080',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});
