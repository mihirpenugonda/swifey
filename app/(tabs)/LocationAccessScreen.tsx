import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { supabase } from '../../supabaseClient';
import HeaderLogo from '../../components/HeaderLogo';
import { updateUserProfile } from '@/services/apiService';

export default function LocationAccessScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Permission to access location was denied. Please enable it in settings.'
          );
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);

        await storeLocation(locationData);

        router.push('/OnboardingScreen');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        Alert.alert('Error', 'Failed to get location. Please try again.');
      }
    })();
  }, []);

  const storeLocation = async (locationData: Location.LocationObject) => {
    try {
      
      await updateUserProfile({
        location: locationData,
        onboarding_step: "completed",
      });

      console.log('Location stored successfully');
    } catch (error) {
      console.error('Error storing location:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', 'Failed to store location. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLogoContainer}>
        <HeaderLogo />
      </View>
      <Text style={styles.text}>Accessing your location...</Text>
      {location && (
        <Text style={styles.locationText}>
          Location: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121515',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});