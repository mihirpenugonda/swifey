import React from 'react';
import { View, Text, StyleSheet, TextInput , Dimensions} from 'react-native';
import HeaderLogo from '../../components/HeaderLogo'; 
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function VerificationScreen() { 
    const router = useRouter();
    const handleEnterOTP = () => {
        router.push('/ProfileSetupScreen');
      };
    const { width } = Dimensions.get('window');
const boxSize = width * 0.12;
  return (
    <View style={styles.container}>
         <HeaderLogo/>
      <Text style={styles.title}>VERIFY YOUR EMAIL</Text>
      <View style={styles.boxContainer}>
        {Array(6).fill('').map((_, index) => (
          <TextInput
          key={index}
          style={[styles.inputBox, { width: boxSize, height: boxSize }]} 
          keyboardType="numeric"
          maxLength={1}
        />
        ))}
      </View>
      <CustomButton buttonText="ENTER OTP" onPress={handleEnterOTP} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121515',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 12, 
    marginBottom: 16
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: '#rgba(255, 255, 255, 0.5)',
  },
});
