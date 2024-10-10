import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface PhotoPermissionsModalProps {
  onClose: () => void;
}

const PhotoPermissionsModal: React.FC<PhotoPermissionsModalProps> = ({
  onClose,
}) => {
  const handleUpdateSettings = async () => {
    // Close the modal
    onClose();

    // Open the app settings
    await Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/addPhotosModal.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Allow Access to Photos</Text>
        <Text style={styles.description}>
          We need access to your photos so you can upload and share your best
          moments!
        </Text>
      </View>

      <LinearGradient
        colors={["#FF56F8", "#B6E300"]}
        start={{ x: -0.1338, y: 0 }}
        end={{ x: 1.0774, y: 0 }}
        style={styles.updateButton}
      >
        <TouchableOpacity
          onPress={handleUpdateSettings}
          style={styles.updateButtonTouchable}
        >
          <Text style={styles.updateButtonText}>UPDATE SETTINGS</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity style={styles.noThanksButton} onPress={onClose}>
        <Text style={styles.noThanksButtonText}>NO THANKS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F3F3",
    borderRadius: 32,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 170,
    height: 145,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E61860",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  updateButton: {
    borderRadius: 25,
    marginBottom: 10,
    width: "100%",
  },
  updateButtonTouchable: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#313131",
    fontWeight: "600",
  },
  noThanksButton: {
    padding: 10,
  },
  noThanksButtonText: {
    color: "#313131",
  },
  noThanksGradient: {
    borderRadius: 25,
    width: "100%",
  },
});

export default PhotoPermissionsModal;
