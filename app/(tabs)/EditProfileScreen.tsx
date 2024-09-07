import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
const [loading, setLoading] = useState(false);

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }
  
      const { data, error } = await supabase
        .from('profiles')
        .select('name, date_of_birth, bio, photos')
        .eq('id', user.id)
        .single();
  
      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
      }
  
      setName(data.name || '');
      setBio(data.bio || '');
      
      if (data.date_of_birth) {
        const birthDate = new Date(data.date_of_birth);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge.toString());
      }
  
      const fetchedImages = data.photos || [];
      const imageUrls = fetchedImages.map((path: string) => {
        if (path.startsWith('https://')) {
          return path; 
        }

        return `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${path}`;
      });
  
      setImages([...imageUrls, ...Array(6 - imageUrls.length).fill(null)]);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    }
  };
  
  const handleAddImage = async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets[0].uri) {
        const newImages = [...images];
        newImages[index] = result.assets[0].uri;
        setImages(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not logged in or error fetching user.');
      }
  

      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - parseInt(age);
      const dateOfBirth = new Date(birthYear, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
  

      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('photos')
        .eq('id', user.id)
        .single();
  
      if (fetchError) throw fetchError;
  
      const currentPhotos = currentProfile.photos || [];
      const newPhotos = images.filter(Boolean) as string[];
  

      const photosToDelete = currentPhotos.filter((photo: string) => !newPhotos.includes(photo));
  

      const photosToAdd = newPhotos.filter(photo => !currentPhotos.includes(photo));
  

      for (const photo of photosToDelete) {
        const { error: deleteError } = await supabase.storage
          .from('photos')
          .remove([photo]);
        if (deleteError) throw deleteError;
      }
  

      const addedPhotos = await Promise.all(photosToAdd.map(async (photo, index) => {
        if (photo.startsWith('file://') || photo.startsWith('content://')) {

          const base64Data = await FileSystem.readAsStringAsync(photo, {
            encoding: FileSystem.EncodingType.Base64,
          });
  

          const arrayBuffer = Buffer.from(base64Data, 'base64');
          const fileExt = photo.split('.').pop();
          const fileName = `${Date.now()}_${index}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
  
          const { data, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(filePath, arrayBuffer, {
              contentType: `image/${fileExt}`,
              cacheControl: '3600',
            });
  
          if (uploadError) throw uploadError;
  
          return filePath;
        } else {

          return photo.split('/').slice(-2).join('/');
        }
      }));
  

      const updatedPhotos = [
        ...currentPhotos.filter((photo: any) => !photosToDelete.includes(photo)),
        ...addedPhotos
      ];
  

      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          date_of_birth: dateOfBirth,
          bio,
          photos: updatedPhotos,
        })
        .eq('id', user.id);
  
      if (error) throw error;
  
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  
  const renderImageSlot = ({ item, index }: { item: string | null; index: number }) => (
    <TouchableOpacity style={styles.imageSlot} onPress={() => handleAddImage(index)}>
      {item ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item }} style={styles.image} />
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => handleRemoveImage(index)}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.addImageText}>+</Text>
      )}
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      Alert.alert('Logged out', 'You have been successfully logged out.');
      router.replace('/LoginScreen'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // const handleDeleteAccount = async () => {
  //   Alert.alert(
  //     "Confirm Account Deletion",
  //     "Are you sure you want to delete your account? This action cannot be undone.",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             setLoading(true);
  //             const { data: { user }, error: userError } = await supabase.auth.getUser();
  //             if (userError || !user) {
  //               throw new Error('User not logged in or error fetching user.');
  //             }

  //             // Delete user account using the admin API
  //             const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  //             if (deleteError) {
  //               throw new Error(deleteError.message);
  //             }

  //             Alert.alert('Account Deleted', 'Your account has been deleted.');
  //             router.replace('/SignUpScreen'); 
  //           } catch (error) {
  //             console.error('Error deleting account:', error);
  //             Alert.alert('Error', 'Failed to delete account. Please try again.');
  //           } finally {
  //             setLoading(false);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('../../assets/images/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Edit Profile</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.subTitle}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.subTitle}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <Text style={styles.subTitle}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Text style={styles.subTitle}>Profile Images</Text>
          <FlatList
            data={images}
            renderItem={renderImageSlot}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.imageRow}
            style={styles.imageGrid}
          />

          <TouchableOpacity style={styles.buttonWrapper} onPress={handleSave} disabled={isSaving}>
            <LinearGradient
              colors={['#FF56F8', '#B6E300']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              {isSaving ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.buttonText}>SAVE</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.logoutContainer}>
            <TouchableOpacity style={[styles.logoutButton, styles.gradientBorder]} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleLogout} disabled={loading}>
              <Text style={styles.deleteButtonText}>{loading ? 'Deleting...' : 'DELETE MY ACCOUNT'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  appBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#F4F9F5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F4F9F5',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  subTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  imageGrid: {
    width: '100%',
    marginBottom: 16,
  },
  imageRow: {
    justifyContent: 'space-between',
  },
  imageSlot: {
    width: '30%', 
    aspectRatio: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
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
    bottom: -5,
    right: -5,
    backgroundColor: '#868686',
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  gradientBorder: {
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoutButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 5,
  },  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  deleteButton: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginLeft: 5,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});