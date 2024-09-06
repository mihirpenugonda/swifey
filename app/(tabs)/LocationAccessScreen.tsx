import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { supabase } from '../../supabaseClient';
import HeaderLogo from '../../components/HeaderLogo';

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

        // Store location in Supabase
        await storeLocation(locationData);

        // Navigate to the next screen
        router.push('/navigator/AppNavigator');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        Alert.alert('Error', 'Failed to get location. Please try again.');
      }
    })();
  }, []);

  const storeLocation = async (locationData: Location.LocationObject) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }

      const locationJson = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        accuracy: locationData.coords.accuracy,
        timestamp: locationData.timestamp
      };

      const { error } = await supabase
        .from('profiles')
        .update({ location: locationJson })
        .eq('id', user.id);

      if (error) {
        throw new Error(`Error updating location: ${error.message}`);
      }

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