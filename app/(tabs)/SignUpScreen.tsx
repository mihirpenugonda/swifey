import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';
import HeaderLogo from '@/components/HeaderLogo';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false); 
  const router = useRouter();

  const handleSignUp = async () => {
    if (isCooldown) {
      Alert.alert('Please wait', 'You need to wait a few minutes before requesting again.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
        email,
        password
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Check your email',
        'A verification code has been sent to your email address. Please enter the code to verify your account.'
      );
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 300000); 
      router.push('/NameInputScreen');
    }
  };

  return (
    <View style={styles.container}>
         <HeaderLogo />
      <Text style={styles.title}>What's your email address?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
        <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#666"
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Loading...' : 'Sign Up'} onPress={handleSignUp} disabled={loading || isCooldown} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121515',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
});
