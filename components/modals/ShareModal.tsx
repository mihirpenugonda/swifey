import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ShareIcon = require("../../assets/images/icons/share.png");

interface ShareModalProps {
  onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onShare }) => {
  return (
    <View style={styles.container}>
      <Image source={ShareIcon} style={styles.icon} />
      <Text style={styles.title}>
        Why write about yourself when your friends can do it better?
      </Text>
      <Text style={styles.subtitle}>Get your friends to pitch you.</Text>
      <Text style={styles.additionalText}>They know you best!</Text>
      <TouchableOpacity onPress={onShare}>
        <LinearGradient
          colors={["#FF56F8", "#B6E300"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shareButton}
        >
          <Text style={styles.shareButtonText}>SHARE</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flex: 1
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  additionalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  shareButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shareButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ShareModal;
