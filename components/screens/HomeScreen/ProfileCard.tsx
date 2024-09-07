// components/ProfileCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ProfileCardProps {
  name: string;
  age: number;
  photos: string[];
  bio: string;
  currentImageIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, age, photos, bio, currentImageIndex, onSwipeLeft, onSwipeRight }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: photos[currentImageIndex] }} style={styles.image} />
      <Text style={styles.profileName}>{name}, {age}</Text>
      <Text style={styles.profileBio}>{bio}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onSwipeLeft} style={styles.button}>
          <Text style={styles.buttonText}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwipeRight} style={styles.button}>
          <Text style={styles.buttonText}>😘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileBio: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileCard;
