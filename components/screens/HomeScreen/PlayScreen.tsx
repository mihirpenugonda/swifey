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
];

export default function PlayScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const swiperRef = useRef<Swiper<any>>(null);

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
            handleSwipeLeft();
            setCurrentProfileIndex((prevIndex) => Math.min(prevIndex + 1, profiles.length - 1));
          }}
          onSwipedRight={() => {
            handleSwipeRight();
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
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 1,
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
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  headerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20,  
  }
,  
bagContainer: {
  flexDirection: 'row', 
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginRight: 10, // Ensure there's space on the right side
  paddingHorizontal: 5, // Padding to prevent text from sticking to the edges
  backgroundColor: 'transparent', // Make sure there's no background that blends with the text
  zIndex: 10, // Make sure container is above other elements
}
,
  bagImage: {
    width: 24, // Adjust width as needed
    height: 24, // Adjust height as needed
    marginRight: 8, // Space between image and text
  },
  usdText: {
    color: '#000', // Ensure this is a visible color against your background
    fontFamily: 'Tomorrow', // Make sure this font is loaded; if not, use a default font
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17.4,
    textAlign: 'left',
    zIndex: 10, // Ensure text is above other elements
    backgroundColor: 'transparent', // Just in case, set a background to none
  },
  
  swiperContainer: {
    flex: 1,
  },
  card: {
    height: '70%',
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
});
