import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import HeaderLogo from '../../components/HeaderLogo';
import { useRouter } from 'expo-router';

export default function NameInputScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNameSubmit = () => {
    if (name.trim().length > 0) {
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
  },
});
