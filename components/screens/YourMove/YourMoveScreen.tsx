import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import AppBar from '../../AppBar';
import { fetchMatches, fetchMyTurnProfiles, sendSwipe } from '../../../services/apiService'; // Assuming you have an API service
import eventEmitter from '@/services/eventEmitter';


interface MoveItem {
  id: string;
  name: string;
  imageUri?: string;
}

export default function YourMoveScreen() {
  const [data, setData] = useState<MoveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MoveItem | null>(null); // Store the selected profile
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const swiperRef = useRef(null); // Ref for future swipe logic
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const profiles = await fetchMyTurnProfiles(20, 0); // Fetch 20 profiles with an offset of 0
      const formattedProfiles = profiles.map((profile: any) => ({
        id: profile.id,
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

  // Open the modal with the selected profile
  const openProfileModal = (profile: MoveItem) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  // Close the modal
  const closeProfileModal = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };

// Handle swipe left (Rug)
const handleSwipeLeft = async () => {
  try {
    const currentProfile = selectedProfile;
    console.log('Current Profile on Rug Swipe:', currentProfile);

    if (!currentProfile?.id) {  
      console.error('Profile ID is missing');
      return;
    }

    const response = await sendSwipe(currentProfile?.id, 'rug');
    
    if (response?.message === 'You have already swiped on this profile') {
      console.log(`You have already swiped on this profile. Past decision: ${response.past_decision}`);
      return;
    }

    console.log('Swipe response:', response);
    processSwipeResponse(response);

    // Remove the swiped profile from the data array
    setData((prevData) => prevData.filter((profile) => profile.id !== currentProfile.id));

    closeProfileModal(); // Close modal after swipe
  } catch (error) {
    console.error('Error sending rug swipe:', error);
  }
};

// Handle swipe right (Kiss)
const handleSwipeRight = async () => {
  try {
    const currentProfile = selectedProfile;
    console.log('Current Profile on Kiss Swipe:', currentProfile);

    if (!currentProfile?.id) {  
      console.error('Profile ID is missing');
      return;
    }

    const response = await sendSwipe(currentProfile?.id, 'kiss');
    
    if (response?.message === 'You have already swiped on this profile') {
      console.log(`You have already swiped on this profile. Past decision: ${response.past_decision}`);
      return;
    }

    console.log('Swipe response:', response);
    processSwipeResponse(response);
    
    eventEmitter.emit('matchMade');
    // Remove the swiped profile from the data array
    setData((prevData) => prevData.filter((profile) => profile.id !== currentProfile.id));

    closeProfileModal(); // Close modal after swipe
  } catch (error) {
    console.error('Error sending kiss swipe:', error);
  }
};


  // Process swipe response
  const processSwipeResponse = (response: { decision: string; match_id: any; }) => {
    if (response.decision === 'match') {
      console.log('It’s a match! Match ID:', response.match_id);
    } else if (response.decision === 'pending') {
      console.log('Swipe is pending');
    } else if (response.decision === 'rugged') {
      console.log('Rugged!');
    } else if (response.decision === 'profit') {
      console.log('Profit earned!');
    } else if (response.decision === 'mutual_rug') {
      console.log('Mutual rug!');
    }
  };

  // Render individual profile in the grid
  const renderItem = ({ item }: { item: MoveItem }) => (
    <TouchableOpacity style={styles.moveItem} onPress={() => openProfileModal(item)}>
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require('../../../assets/images/your-move-placeholder.png')}
        style={styles.placeholderImage}
      />
      <Text style={styles.mainText}>
        When others make a move on you, it'll show up here.
      </Text>
      <Text style={styles.subText}>
        Keep your profile presentable for higher matches!
      </Text>
  
      <View style={styles.dosDontsContainer}>
        {/* DOs Section */}
        <View style={styles.dosContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.dosTitle}>DOs</Text>
            
          </View>
          <Text style={styles.dosText}>1. Use recent, high-quality photos.</Text>
          <Text style={styles.dosText}>2. Be genuine and authentic in your bio.</Text>
          <Text style={styles.dosText}>3. Keep it positive and engaging.</Text>
        </View>
  
        {/* DON'Ts Section */}
        <View style={styles.dontsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.dontsTitle}>DON'Ts</Text>
            
          </View>
          <Text style={styles.dontsText}>
            1. Don’t use outdated or heavily edited photos.
          </Text>
          <Text style={styles.dontsText}>
            2. Don’t focus on negatives or dislikes in your bio.
          </Text>
          <Text style={styles.dontsText}>
            3. Don’t write overly long or detailed bios.
          </Text>
        </View>
      </View>
  
    </View>
  );
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <Text style={styles.header}>Your Turn</Text>
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

      {/* Profile Modal */}
      {selectedProfile && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeProfileModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedProfile.imageUri }}
                style={[styles.modalImage, { height: screenHeight * 0.6 }]} // Image takes up 60% of screen height
              />
              <Text style={styles.modalName}>{selectedProfile.name}</Text>

              {/* Kiss and Rug Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.rugButton} onPress={handleSwipeLeft}>
                  <Text style={styles.buttonText}>❌ Rug</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.kissButton} onPress={handleSwipeRight}>
                  <Text style={styles.buttonText}>😘 Kiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E9000C',
    textAlign: 'left',
    marginVertical: 10,
    marginHorizontal: 16,
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
    alignItems: 'center',
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
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#000',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '80%',
    borderRadius: 10,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  rugButton: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  kissButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    dontsContainer: {
      backgroundColor: '#FFBABA',
      padding: 10,
      borderRadius: 8,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    dosTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4F8A10',
    },
    dontsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#D8000C',
    },
    dosText: {
      fontSize: 14,
      color: '#4F8A10',
    },
    dontsText: {
      fontSize: 14,
      color: '#D8000C',
    },
    checkIcon: {
      width: 20,
      height: 20,
      tintColor: '#4F8A10',
    },
    crossIcon: {
      width: 20,
      height: 20,
      tintColor: '#D8000C',
    },
    goToProfileButton: {
      width: '80%',
      backgroundColor: '#FF0080',
      borderRadius: 30,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goToProfileText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
    },
  });
  
