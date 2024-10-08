import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Dimensions,
  Modal,
  Linking,
  AppState,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../supabaseClient";
import HeaderLogo from "../../components/HeaderLogo";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import * as ImageManipulator from "expo-image-manipulator";
import { updateUserProfile } from "@/services/apiService";
import uuid from "react-native-uuid";
import Container from "@/components/Container";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddPhotosScreen() {
  const [images, setImages] = useState<(string | null)[]>(Array(6).fill(null));
  const [isUploading, setIsUploading] = useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(
    null
  );

  const screenWidth = Dimensions.get("window").width;
  const padding = 20; // Horizontal padding
  const gap = 5; // Gap between image slots
  const numColumns = 3;
  const imageSlotWidth = Math.floor(
    (screenWidth - 2 * padding - (numColumns - 1) * gap) / numColumns
  );

  useEffect(() => {
    checkPhotoLibraryPermissions();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      checkPhotoLibraryPermissions();
    }
  };

  const checkPhotoLibraryPermissions = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setIsPermissionModalVisible(true);
    } else {
      setIsPermissionModalVisible(false);
    }
    setHasCheckedPermissions(true);
  };

  useEffect(() => {
    const hasPhotos = images.some((image) => image !== null);
    setIsNextButtonDisabled(!hasPhotos);
  }, [images]);

  const handleAddImage = async (index: number): Promise<void> => {
    if (!hasCheckedPermissions) {
      await checkPhotoLibraryPermissions();
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setIsPermissionModalVisible(true);
      return;
    }

    setLoadingImageIndex(index);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;

        const compressedImage = await ImageManipulator.manipulateAsync(
          selectedImageUri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = compressedImage.uri;
          return newImages;
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image. Please try again.");
    } finally {
      setLoadingImageIndex(null);
    }
  };

  const handleRemoveImage = (index: number): void => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
  };

  const handleNext = async () => {
    setIsUploading(true);
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");

      if(!jwtToken) {
        throw new Error("No JWT token found.");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(jwtToken);
      if (userError || !user) {
        throw new Error("User not logged in or error fetching user.");
      }

      const uploadedImagePaths = [];

      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        if (imageUri) {
          const base64Data = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const arrayBuffer = Buffer.from(base64Data, "base64");

          const fileExt = "jpg";
          const fileName = `photo-${i}-${uuid.v4()}-${user.id}.${fileExt}`;

          const { data: storageData, error: storageError } =
            await supabase.storage
              .from("photos")
              .upload(`${user.id}/${fileName}`, arrayBuffer, {
                contentType: "image/jpeg",
                cacheControl: "3600",
                upsert: false,
              });

          if (storageError) {
            throw new Error("Error uploading image to storage");
          }

          if (storageData && storageData.path) {
            uploadedImagePaths.push(storageData.path);
          } else {
            throw new Error("Storage data is missing the path.");
          }
        }
      }

      await updateUserProfile({
        photos: uploadedImagePaths,
      });

      router.push("/GenderSelectionScreen");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const renderImageSlot = ({
    item,
    index,
  }: {
    item: string | null;
    index: number;
  }) => (
    <View style={[styles.imageSlotContainer, { width: imageSlotWidth }]}>
      <TouchableOpacity
        style={[
          styles.imageSlot,
          { width: imageSlotWidth, height: imageSlotWidth * 1.18 },
        ]}
        onPress={() => handleAddImage(index)}
        disabled={loadingImageIndex !== null}
      >
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
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />

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

          <TouchableOpacity
            style={[
              styles.buttonWrapper,
              isNextButtonDisabled && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={isUploading || isNextButtonDisabled}
          >
            <LinearGradient
              colors={["#FF56F8", "#B6E300"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isPermissionModalVisible}
          onRequestClose={() => setIsPermissionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Permission Required</Text>
              <Text style={styles.modalText}>
                Hey there! We need your awesome pics to make your dating profile
                shine. Let's get those photos ready to impress potential
                matches!
              </Text>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => {
                  openAppSettings();
                  setIsPermissionModalVisible(false);
                }}
              >
                <Text style={styles.settingsButtonText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
    color: "#313131",
    marginBottom: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageGrid: {
    marginBottom: 20,
  },
  imageRow: {
    justifyContent: "space-between",
  },
  imageSlotContainer: {
    position: "relative",
    marginBottom: 10,
  },
  imageSlot: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "#313131",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DEDEDE",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  removeButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    textAlign: "center",
  },
  addImageText: {
    fontSize: 24,
    color: "#666",
  },
  buttonWrapper: {
    width: "100%",
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#F4F9F5",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  settingsButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: "100%",
  },
  settingsButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
