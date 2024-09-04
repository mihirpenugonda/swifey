import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('Abhilash');
  const [age, setAge] = useState('33');
  const [bio, setBio] = useState("If you’re an attractive woman or a man, you want to be on this app. You’ll rug a lot of people and make money.");
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const handleAddImage = (_index: number): void => {
    // Add image logic
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
      {/* Custom AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
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

        {/* Save Button with Gradient */}
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => router.back()}>
          <LinearGradient
            colors={['#FF56F8', '#B6E300']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>SAVE</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={[styles.logoutButton, styles.gradientBorder]}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>DELETE MY ACCOUNT</Text>
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
    width: 100,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
