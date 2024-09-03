import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AppBar from '../../AppBar';

const { width } = Dimensions.get('window');

// Mock data for profiles
const profiles = [
  {
    id: 1,
    name: 'TattooGirl',
    age: 28,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 2,
    name: 'T',
    age: 8,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 3,
    name: 'A',
    age: 18,
    images: [
      require('../../../assets/images/profile1_1.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
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
  const swiperRef = useRef(null);

  const handleSwipeLeft = () => {
    console.log('Rejected');
    resetImageIndex();
  };

  const handleSwipeRight = () => {
    console.log('Accepted');
    resetImageIndex();
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

      console.log(`Image tapped: ${direction}`);
      console.log(`New image index: ${newIndex}`);

      return newIndex;
    });
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {profiles[currentProfileIndex].images.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            <View
              style={[
                styles.activeProgress,
                {
                  width: index <= currentImageIndex ? '100%' : '0%',
                  backgroundColor: index <= currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                },
              ]}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      {renderProgressBar()}
      <Swiper
        ref={swiperRef}
        cards={profiles}
        renderCard={(profile) => (
          <View style={styles.card} key={`${profile.id}-${currentImageIndex}`}>
            {/* Ensure the Text components are used correctly */}
            <Image source={profile.images[currentImageIndex]} style={styles.image} />
            <TouchableOpacity style={styles.leftTapArea} onPress={() => handleImageTap('left')} />
            <TouchableOpacity style={styles.rightTapArea} onPress={() => handleImageTap('right')} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.profileDescription}>{profile.description}</Text>
            </View>
          </View>
        )}
        onSwipedLeft={handleSwipeLeft}
        onSwipedRight={handleSwipeRight}
        onSwipedAll={() => console.log('All cards swiped')}
        cardIndex={0}
        stackSize={3}
        onSwiped={(cardIndex) => {
          setCurrentProfileIndex(cardIndex + 1);
          resetImageIndex();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  card: {
    flex: 1,
    borderRadius: 8,
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
  profileInfo: {
    position: 'absolute',
    bottom: 20,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeProgress: {
    height: '100%',
    backgroundColor: 'white',
  },
});
