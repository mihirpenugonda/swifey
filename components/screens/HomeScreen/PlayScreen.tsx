import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AppBar from '../../AppBar';

const { width, height } = Dimensions.get('window'); // Include height to use for card height

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
    name: 'T',
    age: 8,
    images: [
      require('../../../assets/images/profile1_2.png'),
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
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 4,
    name: 'Bbbbb',
    age: 18,
    images: [
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
  {
    id: 5,
    name: 'DDDddd',
    age: 18,
    images: [
      require('../../../assets/images/profile1_3.png'),
      require('../../../assets/images/profile1_2.png'),
      require('../../../assets/images/profile1_3.png'),
    ],
    description: "If you're an attractive woman or a man, you want to be on this app. You'll rug a lot of people and make money.",
  },
];

export default function PlayScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const swiperRef = useRef<Swiper<any>>(null);

  const handleSwipeLeft = () => {
    console.log('Rejected');
    resetImageIndex();
    swiperRef.current?.swipeLeft(); // Trigger swipe left programmatically
  };

  const handleSwipeRight = () => {
    console.log('Accepted');
    resetImageIndex();
    swiperRef.current?.swipeRight(); // Trigger swipe right programmatically
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar showRightSide={true}/>
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={profiles}
          renderCard={(profile) => (
            <View style={styles.card} key={`${profile.id}-${currentImageIndex}`}>
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
});