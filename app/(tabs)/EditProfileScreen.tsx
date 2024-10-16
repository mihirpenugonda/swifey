import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../../supabaseClient";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserProfile } from "@/services/apiService";
import { getAuthenticatedUser } from "@/helpers/auth";
import * as ImageManipulator from "expo-image-manipulator";

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");

      if (!jwtToken) {
        throw new Error("JWT token not found in AsyncStorage");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(jwtToken);
      if (userError || !user) {
        throw new Error("User not logged in or error fetching user.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, date_of_birth, bio, photos")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
      }

      setName(data.name || "");
      setBio(data.bio || "");

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
        if (path.startsWith("https://")) {
          return path;
        }

        return `https://exftzdxtyfbiwlpmecmd.supabase.co/storage/v1/object/public/photos/${path}`;
      });

      setImages([...imageUrls, ...Array(6 - imageUrls.length).fill(null)]);
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert("Error", "Failed to load profile data. Please try again.");
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
        const compressedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const newImages = [...images];
        newImages[index] = compressedImage.uri;
        setImages(newImages);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
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
      const authenticatedUser = await getAuthenticatedUser();
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - parseInt(age);
      const dateOfBirth = new Date(
        birthYear,
        currentDate.getMonth(),
        currentDate.getDate()
      )
        .toISOString()
        .split("T")[0];

      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("photos")
        .eq("id", authenticatedUser.id)
        .single();

      console.log(currentProfile, "currentProfile");
      if (fetchError) throw fetchError;

      const currentPhotos = currentProfile.photos || [];
      const newPhotos = images.filter(Boolean) as string[];

      const photosToDelete = currentPhotos.filter(
        (photo: string) => !newPhotos.includes(photo)
      );

      const photosToAdd = newPhotos.filter(
        (photo) => !currentPhotos.includes(photo)
      );

      for (const photo of photosToDelete) {
        const { error: deleteError } = await supabase.storage
          .from("photos")
          .remove([photo]);
        if (deleteError) throw deleteError;
      }

      const addedPhotos = await Promise.all(
        photosToAdd.map(async (photo, index) => {
          if (photo.startsWith("file://") || photo.startsWith("content://")) {
            const base64Data = await FileSystem.readAsStringAsync(photo, {
              encoding: FileSystem.EncodingType.Base64,
            });

            const arrayBuffer = Buffer.from(base64Data, "base64");
            const fileExt = photo.split(".").pop();
            const fileName = `${Date.now()}_${index}.${fileExt}`;
            const filePath = `${authenticatedUser.id}/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
              .from("photos")
              .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                cacheControl: "3600",
              });

            if (uploadError) throw uploadError;

            return filePath;
          } else {
            return photo.split("/").slice(-2).join("/");
          }
        })
      );

      const updatedPhotos = [
        ...currentPhotos.filter(
          (photo: any) => !photosToDelete.includes(photo)
        ),
        ...addedPhotos,
      ];

      const response = await updateUserProfile({
        name,
        date_of_birth: dateOfBirth,
        bio,
        photos: updatedPhotos,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderImageSlot = ({
    item,
    index,
  }: {
    item: string | null;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.imageSlot}
      onPress={() => handleAddImage(index)}
    >
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

      await AsyncStorage.removeItem("jwtToken");
      await AsyncStorage.removeItem("userId");

      router.replace("/EmailScreen");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const hasImages = images.some((image) => image !== null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Image
            source={require("../../assets/images/back-icon.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Edit Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

          <TouchableOpacity
            style={[styles.buttonWrapper, !hasImages && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving || !hasImages}
          >
            <LinearGradient
              colors={hasImages ? ["#FF56F8", "#B6E300"] : ["#ccc", "#ccc"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              {isSaving ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    !hasImages && styles.disabledButtonText,
                  ]}
                >
                  SAVE
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[styles.logoutButton, styles.gradientBorder]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
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
    backgroundColor: "#F4F9F5",
  },
  appBar: {
    width: "100%",
    height: 60,
    backgroundColor: "#F4F9F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F4F9F5",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#000",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  subTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  imageGrid: {
    width: "100%",
    marginBottom: 16,
  },
  imageRow: {
    justifyContent: "space-between",
  },
  imageSlot: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 8,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 24,
    color: "#666",
  },
  removeButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#868686",
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  gradientBorder: {
    borderColor: "#000",
    borderWidth: 1,
    overflow: "hidden",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutContainer: {
    width: "100%",
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#666",
  },
});
