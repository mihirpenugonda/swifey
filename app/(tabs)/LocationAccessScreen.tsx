import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import HeaderLogo from '../../components/HeaderLogo';
import { router } from 'expo-router';

export default function LocationAccessScreen() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied. Please enable it in settings.'
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location); 
      router.push('/navigator/AppNavigator');
    })();
  }, []);

  return (
    <View style={styles.container}>
  
    <View style={styles.headerLogoContainer}>
      <HeaderLogo />
    </View>



      <Text style={styles.text}>Allow your location</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121515',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerLogoContainer: {
    paddingLeft: 20, 
    marginBottom: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
