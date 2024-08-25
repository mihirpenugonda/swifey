// components/LogoWithText.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../assets/images/logo.svg';

const LogoWithText = () => {
  return (
    <View style={styles.logoContainer}>
      <Logo width={100} height={100} />
      <Text style={styles.logoText}>KISS or RUG</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24
      },
      logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF69B4', 
        textAlign: 'center',
        marginTop: 12
      },
      logo: {
        width: 100,  
        height: 100,
        resizeMode: 'contain', 
      },
});

export default LogoWithText;
