import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AppBar from '../../AppBar';
import BottomSheet from '@gorhom/bottom-sheet';
import { fetchMatches, fetchProfiles, sendSwipe } from '../../../services/apiService';
import eventEmitter from '@/services/eventEmitter';

const { width, height } = Dimensions.get('window');

export default function PlayScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const swiperRef = useRef<Swiper<any>>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [allSwiped, setAllSwiped] = useState(false);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedProfiles = await fetchProfiles(20, 0);
      console.log('Fetched profiles:', fetchedProfiles);

      if (Array.isArray(fetchedProfiles) && fetchedProfiles.length > 0) {
        setProfiles(fetchedProfiles);
      } else {
        console.error('No profiles found or invalid response format:', fetchedProfiles);
        setError('No profiles found or invalid response format');
        setProfiles([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching profiles:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length > 0 && currentProfileIndex < profiles.length) {
      console.log('Profile updated to:', profiles[currentProfileIndex]?.id);
    }
  }, [currentProfileIndex, profiles]);

const handleSwipeLeft = async () => {
  try {
    const currentProfile = profiles[currentProfileIndex];
    console.log('Current Profile on Rug Swipe:', currentProfile);

    if (!currentProfile?.id) {  
      console.error('Profile ID is missing');
      return;
    }

    const response = await sendSwipe(currentProfile?.id, 'rug');
    
    if (response?.message === 'You have already swiped on this profile') {
      console.log(`You have already swiped on this profile. Past decision: ${response.past_decision}`);
      swiperRef.current?.swipeLeft();
      return;
    }

    console.log('Swipe response:', response);
    processSwipeResponse(response);
    swiperRef.current?.swipeLeft();

    setCurrentProfileIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= profiles.length ? 0 : nextIndex;
    });
  } catch (error) {
    console.error('Error sending rug swipe:', error);
  }
};

const handleSwipeRight = async () => {
  try {
    const currentProfile = profiles[currentProfileIndex];
    console.log('Current Profile on Kiss Swipe:', currentProfile);

    if (!currentProfile?.id) {  
      console.error('Profile ID is missing');
      return;
    }

    const response = await sendSwipe(currentProfile?.id, 'kiss');
    
    if (response?.message === 'You have already swiped on this profile') {
      console.log(`You have already swiped on this profile. Past decision: ${response.past_decision}`);
      swiperRef.current?.swipeRight();
      return;
    }

    console.log('Swipe response:', response);
    processSwipeResponse(response);
    
    eventEmitter.emit('matchMade');
    
    swiperRef.current?.swipeRight();

    setCurrentProfileIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= profiles.length ? 0 : nextIndex;
    });
  } catch (error) {
    console.error('Error sending kiss swipe:', error);
  }
};

  const processSwipeResponse = (response: { decision: string; match_id: any; }) => {
    if (response.decision === 'match') {
      console.log("It's a match! Match ID", response.match_id);
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

  const resetImageIndex = () => {
    setCurrentImageIndex(0);
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleImageTap = (direction: string) => {
    setCurrentImageIndex((prevIndex) => {
      const imagesLength = profiles[currentProfileIndex]?.photos?.length || 0;
      let newIndex = prevIndex;

      if (direction === 'left' && prevIndex > 0) {
        newIndex = prevIndex - 1;
      } else if (direction === 'right' && prevIndex < imagesLength - 1) {
        newIndex = newIndex + 1;
      }

      return newIndex;
    });
  };

  const handleBookButtonPress = () => {
    console.log('Book button pressed');
    setBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const renderBottomSheetContent = () => {
    const profile = profiles[currentProfileIndex];
    if (!profile) return null;

    return (
      <View style={styles.bottomSheetContainer}>
        <View style={styles.whiteContainer}>
          <Image source={{ uri: profile?.photos?.[0] || '' }} style={styles.bottomSheetImage} borderRadius={50} />
          <Text style={styles.bottomSheetName}>{profile?.name || 'Unknown'}, {profile?.date_of_birth ? calculateAge(profile.date_of_birth) : 'N/A'}</Text>
          <View style={styles.verifiedContainer}>
            <Image source={require('../../../assets/images/verified-badge.png')} style={styles.verifiedIcon} />
            <Text style={styles.verifiedText}>{profile?.is_verified ? 'Verified' : 'Not Verified'}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar showRightSide={true} />
      <View style={styles.swiperContainer}>
        {allSwiped ? (
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>No profiles left to be swiped</Text>
          </View>
        ) : (
          Array.isArray(profiles) && profiles.length > 0 ? (
            <Swiper
              ref={swiperRef}
              cards={profiles}
              renderCard={(profile) => (
                <View style={styles.card} key={`${profile.id}-${currentImageIndex}`}>
                  <Image source={{ uri: profile?.photos?.[currentImageIndex] || '' }} style={styles.image} />
                  <TouchableOpacity style={styles.leftTapArea} onPress={() => handleImageTap('left')} />
                  <TouchableOpacity style={styles.rightTapArea} onPress={() => handleImageTap('right')} />
                  <TouchableOpacity style={styles.bookButton} onPress={handleBookButtonPress}>
                    <Image source={require('../../../assets/images/book.png')} style={styles.bookIcon} />
                  </TouchableOpacity>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{profile?.name || 'Unknown'}, {profile?.date_of_birth ? calculateAge(profile.date_of_birth) : 'N/A'}</Text>
                    <Text style={styles.profileDescription}>{profile?.bio || ''}</Text>
                  </View>
                </View>
              )}
              onSwipedLeft={handleSwipeLeft}
              onSwipedRight={handleSwipeRight}
              onSwipedAll={() => {
                console.log('All cards swiped');
                setAllSwiped(true);
                setCurrentProfileIndex(0);
              }}
              cardIndex={0}
              stackSize={3}
              backgroundColor={'transparent'}
              cardVerticalMargin={20}
              animateCardOpacity
            />
          ) : (
            <View style={styles.noProfilesContainer}>
              <Text style={styles.noProfilesText}>No profiles available</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSwipeLeft}>
          <Text style={styles.buttonText}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSwipeRight}>
          <Text style={styles.buttonText}>😘</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%', '40%']}
        index={-1}
        onChange={(index) => setBottomSheetOpen(index >= 0)}
        enablePanDownToClose
      >
        {renderBottomSheetContent()}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  swiperContainer: {
    flex: 1,
  },
  card: {
    height: '70%',
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#F4F9F5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  leftTapArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
  },
  bookButton: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    zIndex: 10,
  },
  bookIcon: {
    width: 30,
    height: 30,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  profileName: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileDescription: {
    fontSize: 14,
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: '#FF5A5F',
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  bottomSheetImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  bottomSheetName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: 'red',
  },
  noProfilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProfilesText: {
    fontSize: 16,
    color: '#666',
  },
}); 