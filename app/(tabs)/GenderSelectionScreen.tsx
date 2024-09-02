import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderLogo from '../../components/HeaderLogo';

export default function GenderSelectionScreen() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const router = useRouter();  // Use router for navigation

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    router.push('/PreferenceScreen'); 
  };

  return (
    <View style={styles.container}>
      {/* Header Logo at the top */}
      <View style={styles.headerLogoContainer}>
        <HeaderLogo />
      </View>

      {/* Question */}
      <Text style={styles.title}>What's your gender?</Text>

      {/* Gender Options */}
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedGender === 'Woman' && styles.selectedOptionContainer,
        ]}
        onPress={() => handleGenderSelect('Woman')}
      >
        <Text style={styles.optionText}>Woman</Text>
        <View style={selectedGender === 'Woman' ? styles.selectedCircle : styles.circle}>
          {selectedGender === 'Woman' && <Text style={styles.tick}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedGender === 'Man' && styles.selectedOptionContainer,
        ]}
        onPress={() => handleGenderSelect('Man')}
      >
        <Text style={styles.optionText}>Man</Text>
        <View style={selectedGender === 'Man' ? styles.selectedCircle : styles.circle}>
          {selectedGender === 'Man' && <Text style={styles.tick}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedGender === 'Non-binary' && styles.selectedOptionContainer,
        ]}
        onPress={() => handleGenderSelect('Non-binary')}
      >
        <Text style={styles.optionText}>Non-binary</Text>
        <View style={selectedGender === 'Non-binary' ? styles.selectedCircle : styles.circle}>
          {selectedGender === 'Non-binary' && <Text style={styles.tick}>✓</Text>}
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
