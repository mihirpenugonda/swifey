import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabaseClient';
import HeaderLogo from '../../components/HeaderLogo';

export default function GenderSelectionScreen() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const router = useRouter();

  const handleGenderSelect = async (gender: string) => {
    setSelectedGender(gender);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ gender })
        .eq('id', user.id);

      if (error) {
        throw new Error(`Error updating gender: ${error.message}`);
      }

      console.log('Gender updated successfully');
      router.push('/PreferenceScreen'); // Navigate to the next screen
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLogoContainer}>
        <HeaderLogo />
      </View>

      <Text style={styles.title}>What's your gender?</Text>

      {['woman', 'man', 'non-binary'].map((gender) => (
        <TouchableOpacity
          key={gender}
          style={[
            styles.optionContainer,
            selectedGender === gender && styles.selectedOptionContainer,
          ]}
          onPress={() => handleGenderSelect(gender)}
        >
          <Text style={styles.optionText}>{gender}</Text>
          <View style={selectedGender === gender ? styles.selectedCircle : styles.circle}>
            {selectedGender === gender && <Text style={styles.tick}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}
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
  headerLogoContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  selectedOptionContainer: {
    backgroundColor: '#444',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF56F8',  // Pink background for the selected state
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    color: '#fff', // White tick mark
    fontSize: 16,
    fontWeight: 'bold',
  },
});
