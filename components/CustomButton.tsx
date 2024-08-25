// components/CustomButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CustomButtonProps = {
  buttonText: string;
  onPress: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({ buttonText, onPress }) => {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={onPress}>
      <Text style={styles.submitButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    width: '90%',
    height: 51,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D3B8E',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#D9D9D9',
  },


});

export default CustomButton;
