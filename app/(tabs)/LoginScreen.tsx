import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { inputStyle } from "@/helpers/styles";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../assets/images/newLogo.svg";
import { validateInviteCode } from "@/services/apiService";
import { router } from "expo-router";

const LoginScreen: React.FC = () => {
  const [inviteCode, setInviteCode] = useState("");

  const validate = async (code: string) => {
    try {
      const response = await validateInviteCode(code);
      if (response.isValid) {
        router.push("/EmailScreen");
      } else {
        Alert.alert(
          "Invalid Code",
          "The invite code you entered is not valid. Please try again."
        );
      }
    } catch (error) {
      console.error("Error validating invite code:", error);
      Alert.alert("Error", "Failed to validate invite code. Please try again.");
    }
  };

  const handleInviteCodeSubmit = (code: string) => {
    if (code && code.length === 6) {
      validate(code);
    } else {
      Alert.alert("Error", "Enter a valid code.");
    }
  };

  const handleInviteCodeChange = (text: string) => {
    const upperText = text.toUpperCase().slice(0, 6);
    setInviteCode(upperText);
    if (upperText.length === 6) {
      handleInviteCodeSubmit(upperText);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
              <View style={styles.logoContainer}>
                <Logo />
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.title}>We're{"\n"}invite only</Text>
                <View style={{ gap: 10 }}>
                  <TextInput
                    value={inviteCode}
                    placeholder="ENTER INVITE CODE"
                    style={[inputStyle, {
                      marginHorizontal: 20
                    }]}
                    placeholderTextColor="#888"
                    maxLength={6}
                    onChangeText={handleInviteCodeChange}
                    autoCapitalize="characters"
                  />

                  <TouchableOpacity
                    onPress={() => handleInviteCodeSubmit(inviteCode)}
                  >
                    <LinearGradient
                      colors={["#FF56F8", "#B6E300"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.inviteButton}
                    >
                      <Text style={styles.inviteButtonText}>SUBMIT</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginTop: 36
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
    marginHorizontal: 20,
  },
  inviteButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  inviteButtonText: {
    color: "#313131",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
