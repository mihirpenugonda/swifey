import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CustomButton from '../../CustomButton';
import AppBar from '../../AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const handleAddImage = (_index: number): void => {
  };

  const handleRemoveImage = (index: number): void => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const renderImageSlot = ({ item, index }: { item: string | null; index: number }) => (
    <TouchableOpacity style={styles.imageSlot} onPress={() => handleAddImage(index)}>
      {item ? (
        <View>
          <Image source={{ uri: item }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.addImageText}>+</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <View style={styles.container}>
        <Text style={styles.header}>John D, 23</Text>
        <Text style={styles.description}>
          If you’re an attractive woman or a man, you want to be on this app. You’ll rug a lot of people and make money.
        </Text>

        <FlatList
          data={images}
          renderItem={renderImageSlot}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={styles.imageRow}
          style={styles.imageGrid}
        />

        <CustomButton buttonText="EDIT PROFILE" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121515',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121515',
    padding: 16,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  imageGrid: {
    width: '100%',
    marginBottom: 0,
  },
  imageRow: {
    justifyContent: 'space-between',
    marginBottom: 10,  
  },
  imageSlot: {
    width: 110,  
    height: 130,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 24,
    color: '#666',
  },
  removeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

