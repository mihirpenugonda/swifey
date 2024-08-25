// app/ProfileSetupScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import CustomButton from '../../components/CustomButton';
import AppBar from '../../components/AppBar'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState([null, null, null, null, null, null]); // Initialize empty slots for images

  const handleAddImage = (_index: number): void => {

  };


  const handleRemoveImage = (index: number): void => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSubmit = () => {

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
     

      <Text style={styles.title}>PROFILE</Text>

      <TextInput
        style={styles.input}
        placeholder="NAME"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="AGE"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.subTitle}>PROFILE IMAGES</Text>

      <FlatList
        data={images}
        renderItem={renderImageSlot}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        scrollEnabled={false} 
        columnWrapperStyle={styles.imageRow}
        style={styles.imageGrid}
      />

      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="BIO"
        placeholderTextColor="#666"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <CustomButton buttonText="SUBMIT" onPress={handleSubmit} />
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
    padding: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginVertical: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  bioInput: {
    height: 80, 
  },
  subTitle: {
    color: '#rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginVertical: 10,
  },
  imageGrid: {
    width: '100%',
    marginBottom: 16,
  },
  imageRow: {
    justifyContent: 'space-between',
  },
  imageSlot: {
    width: 100,
    height: 100,
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
