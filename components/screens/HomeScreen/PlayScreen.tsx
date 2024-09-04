import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AppBar from '../../AppBar';
import BottomSheet from '@gorhom/bottom-sheet';
import { Image as ProfileImage } from 'react-native';

const { width, height } = Dimensions.get('window');

const profiles = [
  {
    id: 1,
    name: 'TattooGirl',
    age: 28,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 2,
    name: 'AB',
    age: 16,
    images: [
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 3,
    name: 'BC',
    age: 26,
    images: [
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 4,
    name: 'CD',
    age: 19,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 5,
    name: 'Test124',
    age: 29,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
];

export default function PlayScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const swiperRef = useRef<Swiper<any>>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSwipeLeft = () => {
    console.log('Rejected');
    resetImageIndex();
    swiperRef.current?.swipeLeft();
  };

  const handleSwipeRight = () => {
    console.log('Accepted');
    resetImageIndex();
    swiperRef.current?.swipeRight();
  };

  const resetImageIndex = () => {
    setCurrentImageIndex(0);
  };

  const handleImageTap = (direction: string) => {
    setCurrentImageIndex((prevIndex) => {
      const imagesLength = profiles[currentProfileIndex].images.length;
      let newIndex = prevIndex;

      if (direction === 'left' && prevIndex > 0) {
        newIndex = prevIndex - 1;
      } else if (direction === 'right' && prevIndex < imagesLength - 1) {
        newIndex = prevIndex + 1;
      }

      return newIndex;
    });
  };

  const renderBottomSheetContent = () => {
    const profile = profiles[currentProfileIndex];
    return (
      <View style={styles.bottomSheetContainer}>
        <View style={styles.whiteContainer}>
          <ProfileImage
            source={profile.images[0]}
            style={styles.bottomSheetImage}
            borderRadius={50}
          />
          <Text style={styles.bottomSheetName}>{profile.name}, {profile.age}</Text>
          <View style={styles.verifiedContainer}>
            <Image source={require('../../../assets/images/verified-badge.png')} style={styles.verifiedIcon} />
            <Text style={styles.verifiedText}>Self Verified</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleBookButtonPress = () => {
    console.log('Book button pressed');
    setBottomSheetOpen(true);
    bottomSheetRef.current?.expand(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar showRightSide={true} />
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={profiles}
          renderCard={(profile) => (
            <View style={styles.card} key={`${profile.id}-${currentImageIndex}`}>
              <Image source={profile.images[currentImageIndex]} style={styles.image} />
              <TouchableOpacity style={styles.leftTapArea} onPress={() => handleImageTap('left')} />
              <TouchableOpacity style={styles.rightTapArea} onPress={() => handleImageTap('right')} />
              <TouchableOpacity 
                style={styles.bookButton} 
                onPress={handleBookButtonPress}
              >
                <Image source={require('../../../assets/images/book.png')} style={styles.bookIcon} />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profile.name}, {profile.age}
                </Text>
                <Text style={styles.profileDescription}>{profile.description}</Text>
              </View>
            </View>
          )}
          onSwipedLeft={() => {
            setCurrentProfileIndex((prevIndex) => Math.min(prevIndex + 1, profiles.length - 1));
          }}
          onSwipedRight={() => {
            setCurrentProfileIndex((prevIndex) => Math.min(prevIndex + 1, profiles.length - 1));
          }}
          onSwipedAll={() => {
            console.log('All cards swiped');
            setCurrentProfileIndex(0);
          }}
          cardIndex={0}
          stackSize={3}
          backgroundColor={'transparent'}
          cardVerticalMargin={20}
          animateCardOpacity
          overlayLabels={{
            left: {
              title: '❌$1.00',
              style: {
                label: {
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 16,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: '😘 $1.00',
              style: {
                label: {
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 16,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
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
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    bottom: 170, 
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
    marginVertical: 20,
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
    backgroundColor: '#E0E0E0', // Light grey background
    borderTopLeftRadius: 20, // Rounded corners
    borderTopRightRadius: 20, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteContainer: {
    width: '90%', // Adjust size as needed
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
});
