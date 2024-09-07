import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import AppBar from '../../AppBar';
import { fetchMyTurnProfiles } from '../../../services/apiService'; // Assuming you have an API service

interface MoveItem {
  id: string;
  name: string;
  imageUri?: string;
}

export default function YourMoveScreen() {
  const [data, setData] = useState<MoveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const profiles = await fetchMyTurnProfiles(20, 0); // Fetch 20 profiles with an offset of 0
      const formattedProfiles = profiles.map((profile: any) => ({
        id: profile.user_id,
        name: profile.name,
        imageUri: profile.photos.length > 0 ? profile.photos[0] : undefined, // Use the first photo
      }));
      setData(formattedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image source={require('../../../assets/images/your-move-placeholder.png')} style={styles.placeholderImage} />
      <Text style={styles.mainText}>When others make a move on you, it'll show up here.</Text>
      <Text style={styles.subText}>Keep your profile presentable for higher matches!</Text>

      <View style={styles.dosDontsContainer}>
        <View style={styles.dosContainer}>
          <Text style={styles.dosTitle}>DOs</Text>
          <Text style={styles.dosText}>1. Use recent, high-quality photos.</Text>
          <Text style={styles.dosText}>2. Be genuine and authentic in your bio.</Text>
          <Text style={styles.dosText}>3. Keep it positive and engaging.</Text>
        </View>

        <View style={styles.dontsContainer}>
          <Text style={styles.dontsTitle}>DON'Ts</Text>
          <Text style={styles.dontsText}>1. Don't use outdated or heavily edited photos.</Text>
          <Text style={styles.dontsText}>2. Don't focus on negatives or dislikes in your bio.</Text>
          <Text style={styles.dontsText}>3. Don't write overly long or detailed bios.</Text>
        </View>
      </View>

    
    </View>
  );

  const renderItem = ({ item }: { item: MoveItem }) => (
    <View style={styles.moveItem}>
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      {loading ? (
        <Text>Loading...</Text>
      ) : data.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  moveItem: {
    flex: 1,
    alignItems: 'flex-start',
    marginBottom: 20,
    marginHorizontal: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#808080',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#808080',
    borderRadius: 8,
  },
  name: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'left',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderImage: {
    width: 120,
    height: 140,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  dosDontsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f4f9f5',
    borderRadius: 8,
    marginBottom: 30,
  },
  dosContainer: {
    backgroundColor: '#DFF2BF',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  dosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F8A10',
    marginBottom: 5,
  },
  dosText: {
    fontSize: 14,
    color: '#4F8A10',
  },
  dontsContainer: {
    backgroundColor: '#FFBABA',
    padding: 10,
    borderRadius: 8,
  },
  dontsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D8000C',
    marginBottom: 5,
  },
  dontsText: {
    fontSize: 14,
    color: '#D8000C',
  },
  
});
