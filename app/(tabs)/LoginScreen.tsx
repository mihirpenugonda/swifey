import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';
import HeaderLogo from '@/components/HeaderLogo';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'You are logged in!');
      router.push('/NameInputScreen');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLogo />
      <View style={styles.contentContainer}>
      <Text style={styles.title}>Enter your email and password</Text>
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
  <TouchableOpacity 
        style={styles.buttonWrapper} 
        onPress={handleLogin} 
        disabled={loading} 
      >
        <LinearGradient
          colors={['#FF56F8', '#B6E300']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Log In'}</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  buttonWrapper: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});
