import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderLogo from '../../components/HeaderLogo';
import { useRouter } from 'expo-router';

export default function BirthdayInputScreen() {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };

  const calculateAge = (birthdate: Date) => {
    const diffMs = Date.now() - birthdate.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const handleConfirm = () => {
    if (date) {
      router.push('/AddPhotosScreen');
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>When's your Birthday?</Text>
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: '#FFFFFF' }}>
            {date ? date.toDateString() : 'Select your birth date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleConfirm} style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#FF56F8', '#B6E300']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={[
              styles.gradientButton,
              date ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {date ? `I confirm that I am ${calculateAge(date)} years old` : 'PLEASE SELECT YOUR BIRTH DATE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
            style={styles.datePicker}
          />
        </View>
      )}
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
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '90%',
  },
  gradientButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonEnabled: {
    opacity: 1,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  datePicker: {
    width: '100%',
  },
});
