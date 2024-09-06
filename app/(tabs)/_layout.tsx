import { Stack } from 'expo-router';
import React from 'react';
import { useFonts, WorkSans_700Bold_Italic } from '@expo-google-fonts/work-sans';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    WorkSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="navigator/AppNavigator" />
        <Stack.Screen name="VerificationScreen" /> 
        <Stack.Screen name="NameInputScreen" />
        <Stack.Screen name="BirthdayInputScreen" />
        <Stack.Screen name="AddPhotosScreen" />
        <Stack.Screen name="PreferenceScreen" />
        <Stack.Screen name="GenderSelectionScreen" />
        <Stack.Screen name="SignUpScreen" />
        <Stack.Screen name="LocationAccessScreen" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="EditProfileScreen" />
      </Stack>
    </GestureHandlerRootView>
  );
}
