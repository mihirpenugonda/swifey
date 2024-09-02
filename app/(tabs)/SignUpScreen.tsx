import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Keyboard } from 'react-native';
import { useRouter } from 'expo-router'; 
import HeaderLogo from '../../components/HeaderLogo';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(''); 

  const handleEmailSubmit = () => {
    if (email) { 
      router.push('/VerificationScreen'); 
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLogo/>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>What's your email address?</Text>
        <TextInput
          style={styles.input}
          placeholder="degen@gmail.com"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={handleEmailSubmit}
          returnKeyType="done"
        />
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
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
