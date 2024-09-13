import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabaseClient';
import HeaderLogo from '../../components/HeaderLogo';

export default function PreferenceScreen() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const router = useRouter();

  const preferences = ['woman', 'man', 'non-binary'];

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleNext = async () => {
    if (selectedPreferences.length === 0) {
      Alert.alert('Error', 'Please select at least one preference.');
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ gender_preference: selectedPreferences })
        .eq('id', user.id);

      if (error) {
        throw new Error(`Error updating preferences: ${error.message}`);
      }

      console.log('Preferences updated successfully');
      router.push('/LocationAccessScreen'); 
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

      <Text style={styles.title}>Who can Kiss or Rug you?</Text>

      {preferences.map((preference) => (
        <TouchableOpacity
          key={preference}
          style={[
            styles.optionContainer,
            selectedPreferences.includes(preference) && styles.selectedOptionContainer,
          ]}
          onPress={() => togglePreference(preference)}
        >
          <Text style={styles.optionText}>{preference}</Text>
          <View style={selectedPreferences.includes(preference) ? styles.selectedCircle : styles.circle}>
            {selectedPreferences.includes(preference) && <Text style={styles.tick}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
    backgroundColor: '#FF56F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FF56F8',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});