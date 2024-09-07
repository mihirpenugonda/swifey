import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native';
import HeaderLogo from '../../components/HeaderLogo'; 
import { useRouter } from 'expo-router';
import { supabase } from '../../supabaseClient';

export default function VerificationScreen() { 
  const router = useRouter();
  const { width } = Dimensions.get('window');
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
    const email = 'user-email@example.com';
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'signup'
      });

      if (error) {
        Alert.alert('Verification Failed', error.message);
      } else {
        Alert.alert('Success', 'Your email has been verified. Welcome to KissOrRug!');
        router.push('/NameInputScreen');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
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