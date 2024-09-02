import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import HeaderLogo from '../../components/HeaderLogo';
import { supabase } from '../../supabaseClient'; 
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function NameInputScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleNameSubmit = async () => {
    if (name.trim().length === 0) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }

    setLoading(true);


    const { data: { user }, error: userError } = await supabase.auth.getUser();


    console.log('User data:', user);
    console.log('User error:', userError);

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error', 'No user logged in or error fetching user.');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id, 
      email: user.email, 
      name,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Name has been saved.');
      router.push('/BirthdayInputScreen');  
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLogo />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>What's your name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleNameSubmit}
        />
  
        <TouchableOpacity 
        style={styles.buttonWrapper} 
        onPress={handleNameSubmit} 
        disabled={loading} 
      >
        <LinearGradient
          colors={['#FF56F8', '#B6E300']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Next'}</Text>
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
    textAlign: 'left',
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
