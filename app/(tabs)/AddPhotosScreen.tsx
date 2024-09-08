import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../supabaseClient';
import HeaderLogo from '../../components/HeaderLogo';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export default function AddPhotosScreen() {
  const [images, setImages] = useState<(string | null)[]>(Array(6).fill(null));
  const [isUploading, setIsUploading] = useState(false); // New loading state

  const handleAddImage = async (index: number): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = result.assets[0].uri;
        return newImages;
      });
    }
  };

  const handleRemoveImage = (index: number): void => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
  };

  const handleNext = async () => {
    setIsUploading(true);  // Start loader
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }
  
      const uploadedImagePaths = [];
  
      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        if (imageUri) {
          const base64Data = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          const arrayBuffer = Buffer.from(base64Data, 'base64');
  
          const fileExt = imageUri.split('.').pop();
          const fileName = `photo-${i}-${user.id}.${fileExt}`;
  
          const { data: storageData, error: storageError } = await supabase.storage
            .from('photos')
            .upload(`${user.id}/${fileName}`, arrayBuffer, {
              cacheControl: '3600',
              upsert: false,
            });
  
          if (storageError) {
            throw new Error('Error uploading image to storage');
          }
  
          if (storageData && storageData.path) {
            uploadedImagePaths.push(storageData.path);
          } else {
            throw new Error('Storage data is missing the path.');
          }
        }
      }
  
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('photos')
        .eq('id', user.id)
        .single();
  
      if (fetchError) {
        throw new Error(`Error fetching current profile: ${fetchError.message}`);
      }
  
      const currentPhotos = currentProfile.photos || [];
      const updatedPhotos = [...currentPhotos, ...uploadedImagePaths];
  
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photos: updatedPhotos })
        .eq('id', user.id);
  
      if (updateError) {
        throw new Error(`Error updating user profile: ${updateError.message}`);
      }
  
      router.push('/GenderSelectionScreen');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);  // Stop loader
    }
  };

  const renderImageSlot = ({ item, index }: { item: string | null; index: number }) => (
    <View style={styles.imageSlotContainer}>
      <TouchableOpacity style={styles.imageSlot} onPress={() => handleAddImage(index)}>
        {item ? (
          <>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => handleRemoveImage(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.addImageText}>+</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerLogoContainer}>
        <HeaderLogo />
      </View>
      
      <View style={styles.container}>
        <Text style={styles.header}>Add your photos</Text>

        <FlatList
          data={images}
          renderItem={renderImageSlot}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={styles.imageRow}
          style={styles.imageGrid}
        />

        <TouchableOpacity style={styles.buttonWrapper} onPress={handleNext} disabled={isUploading}>
          <LinearGradient
            colors={['#FF56F8', '#B6E300']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.buttonText}>NEXT</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121515',
  },
  headerLogoContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  imageGrid: {
    marginBottom: 20,
  },
  imageRow: {
    justifyContent: 'space-between',
  },
  imageSlotContainer: {
    position: 'relative',
    margin: 5,
  },
  imageSlot: {
    width: 110,
    height: 130,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DEDEDE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
  },
  removeButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    textAlign: 'center',
  },
  addImageText: {
    fontSize: 24,
    color: '#666',
  },
  buttonWrapper: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});
