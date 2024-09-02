import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderLogo from '../../components/HeaderLogo';
import { router } from 'expo-router';

export default function PreferencesScreen() {
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  const handlePreferenceSelect = (preference: string) => {
    setSelectedPreference(preference);
    router.push('/LocationAccessScreen'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLogoContainer}>
        <HeaderLogo />
      </View>

      <Text style={styles.title}>Who can Kiss or Rug you?</Text>

      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedPreference === 'Only Woman' && styles.selectedOptionContainer,
        ]}
        onPress={() => handlePreferenceSelect('Only Woman')}
      >
        <Text style={styles.optionText}>Only Woman</Text>
        <View style={selectedPreference === 'Only Woman' ? styles.selectedCircle : styles.circle}>
          {selectedPreference === 'Only Woman' && <Text style={styles.tick}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedPreference === 'Only Man' && styles.selectedOptionContainer,
        ]}
        onPress={() => handlePreferenceSelect('Only Man')}
      >
        <Text style={styles.optionText}>Only Man</Text>
        <View style={selectedPreference === 'Only Man' ? styles.selectedCircle : styles.circle}>
          {selectedPreference === 'Only Man' && <Text style={styles.tick}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedPreference === 'Anyone' && styles.selectedOptionContainer,
        ]}
        onPress={() => handlePreferenceSelect('Anyone')}
      >
        <Text style={styles.optionText}>Anyone</Text>
        <View style={selectedPreference === 'Anyone' ? styles.selectedCircle : styles.circle}>
          {selectedPreference === 'Anyone' && <Text style={styles.tick}>✓</Text>}
        </View>
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
});
