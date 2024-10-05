import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMainContext } from "@/helpers/context/mainContext";
import { useBottomModal } from "@/helpers/context/bottomModalContext";

interface InsufficientPlaysModalProps {}

const InsufficientPlaysModal: React.FC<InsufficientPlaysModalProps> = () => {
  const { setCurrentScreen } = useMainContext();
  const { hideModal } = useBottomModal();

  const handleGetPlays = () => {
    hideModal();
    setCurrentScreen("Bag");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💰</Text>
      <Text style={styles.title}>Insufficient Plays.</Text>
      <Text style={styles.subtitle}>You don't have enough plays.</Text>
      <TouchableOpacity onPress={handleGetPlays} style={styles.buttonContainer}>
        <LinearGradient
          colors={["#FF56F8", "#B6E300"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>GET PLAYS</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E61860",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
  },
  buttonText: {
    color: "#313131",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default InsufficientPlaysModal;
