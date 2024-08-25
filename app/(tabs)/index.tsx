// app/index.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 
import HeaderLogo from '../../components/HeaderLogo'; 
import CustomButton from '../../components/CustomButton';

export default function SignUpScreen() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/VerificationScreen');
  }
  return (
    <View style={styles.container}>
    <HeaderLogo/>
      <TextInput
        style={styles.input}
        placeholder="YOUR EMAIL ADDRESS"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomButton buttonText='Submit' onPress={handleSubmit}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121515', 
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF69B4', 
    textAlign: 'center',
    marginTop: 12
  },
  logo: {
    width: 100,  
    height: 100,
    resizeMode: 'contain', 
  },
  input: {
    width: '90%', 
    height: 69,
    borderRadius: 8,
    borderWidth: 1.6,
    borderColor: '#rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#rgba(255, 255, 255, 0.1)',
    marginBottom: 16, 
    backgroundColor: '#121515', 
    fontSize: 18,
  },
  submitButton: {
    width: '90%', 
    height: 51,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3B8E', 
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#D9D9D9', 
  },
});
