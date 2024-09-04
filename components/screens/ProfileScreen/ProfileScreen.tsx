import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AppBar from '../../../components/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const navigateToEditProfile = () => {
    router.push('/EditProfileScreen');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://example.com/avatar.jpg' }} 
          style={styles.avatar}
        />
        <Text style={styles.profileName}>Abhilash, 33</Text>
        <TouchableOpacity style={styles.buttonWrapper} onPress={navigateToEditProfile}>
          <LinearGradient
            colors={['#FF56F8', '#B6E300']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>EDIT PROFILE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Allows absolute positioning of the verification button
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFF', 
  },
  verificationButton: {
    position: 'absolute',
    bottom: 0,
    right: 0, // Slightly outside the avatar's edge to overlap neatly
    backgroundColor: 'white', // Circle background color for contrast
    borderRadius: 15,
    padding: 5,
    elevation: 5, // Adds a subtle shadow effect
  },
  verificationIcon: {
    width: 20,
    height: 20,
  },
  profileName: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '80%',
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
