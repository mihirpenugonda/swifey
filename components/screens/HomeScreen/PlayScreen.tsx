import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121515',
  },
  text: {
    color: '#FFFFFF',
  },
});

export default PlayScreen;
