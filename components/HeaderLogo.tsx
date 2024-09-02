// components/LogoWithText.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NewLogoSvg from '../assets/images/newLogo.svg'; 
import LinesSvg from '../assets/images/lines.svg'; 

const LogoWithText = () => {
  return (
    <View style={styles.headerContainer}>
    <NewLogoSvg width={56} height={56} style={styles.logo} />
    <LinesSvg width={150} height={20} style={styles.progressIndicator} />
  </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',  // Center children horizontally
    marginBottom: 40,
    flexDirection: 'column',  // Stack elements in a column
  },
  logo: {
    alignSelf: 'flex-start',  // Align logo to the left
    marginLeft: 0,  // Adjust as needed
  },
  progressIndicator: {
    marginTop: 20,  // Space between logo and progress indicator
  },
});

export default LogoWithText;
