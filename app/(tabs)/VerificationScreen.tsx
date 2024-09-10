import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import HeaderLogo from '../../components/HeaderLogo'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerificationScreen() { 
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const { email, login, signup } = useLocalSearchParams(); 
  const isSignup = signup === 'true';
  const isLogin = login === 'true'; 
  const boxSize = width * 0.12;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index] = text;
      setOtp(updatedOtp);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

 
      if (updatedOtp.every(value => value.trim().length > 0)) {
        verifyOtp(updatedOtp.join(''));
      }
    }
  };

  const verifyOtp = async (otpCode: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string, 
        token: otpCode,
        type: 'email',  
      });
  
      if (error) {
        Alert.alert('Verification Failed', error.message);
        resetOtpFields(); 
      } else if (data.session) {
        const jwtToken = data.session.access_token;
        const userId = data.user?.id;
  
        if (jwtToken && userId) {
          await AsyncStorage.setItem('jwtToken', jwtToken);
          await AsyncStorage.setItem('userId', userId);
          console.log('JWT Token and User ID stored:', jwtToken, userId);
          
          Alert.alert('Success', 'Your email has been verified!');
          
          Alert.alert('Success', isSignup ? 'Your email has been verified. Welcome to KissOrRug!' : 'Logged in successfully!');
          router.push(isSignup ? '/NameInputScreen' : '/navigator/AppNavigator');  
        } else {
          Alert.alert('Error', 'Could not retrieve session information');
        }
      
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  

  const resetOtpFields = () => {
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus(); 
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = ''; 
      setOtp(updatedOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderLogo />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>VERIFY YOUR EMAIL</Text>

          <View style={styles.boxContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputRefs.current[index] = ref!}
                style={[styles.inputBox, { width: boxSize, height: boxSize }]}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && value === '') {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121515',  
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
    paddingLeft: 16,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    marginHorizontal: 4,
  },
});
