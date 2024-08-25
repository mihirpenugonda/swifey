// components/AppBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../assets/images/logo.svg'; 


const AppBar = () => {
  return (
    <View style={styles.appBar}>
      <Logo width={40} height={40} style={styles.logo} />
      <Text style={styles.logoText}>KISS or RUG</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121515',
    width: '100%',
  },
  logo: {
    marginRight: 8,
  },
  logoText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppBar;
