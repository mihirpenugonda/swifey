import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import SvgLogo from "../../assets/images/logoText.svg";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen: React.FC = () => {
  const handleHandshakePress = () => {
    router.push("/SignUpScreen");
  };

  const handleLoginPress = () => {
    router.push("/LoginScreen");
  };

  return (
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgLogo width={100} height={100} style={styles.logo} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>We’re{"\n"}invite only</Text>

        <TextInput
          placeholder="ENTER INVITE CODE"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <Text style={styles.orText}>OR</Text>

        {/* <TouchableOpacity style={styles.handshakeButton} onPress={handleHandshakePress}>
          <Text style={styles.handshakeButtonText}>DO AN IRL HANDSHAKE</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.handshakeButton}
          onPress={handleHandshakePress}
        >
          <Text style={styles.handshakeButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  handshakeButton: {
    width: "100%",
    backgroundColor: "#ff69b4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  handshakeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.02,
    textAlign: "center",
    marginVertical: 10,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
