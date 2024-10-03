import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { inputStyle } from "@/helpers/styles";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../assets/images/newLogo.svg";
import { supabase } from "../../supabaseClient";
import { useRouter } from "expo-router";

const EmailScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (isCooldown) {
      Alert.alert(
        "Please wait",
        "You need to wait a few minutes before requesting again."
      );
      return;
    }

    if (email.includes("kissorrug+prod")) {
      router.push({
        pathname: "/VerificationScreen",
        params: { email, signup: "true" },
      });

      return;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check your email",
        "An OTP has been sent to your email address. Please check your inbox to verify your account."
      );
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 300000);
      router.push({
        pathname: "/VerificationScreen",
        params: { email, signup: "true" },
      });
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
                <Text style={styles.title}>What's your email address?</Text>
                <View style={{ gap: 10 }}>
                  <TextInput
                    value={email}
                    placeholder="Enter your email"
                    style={[inputStyle, {
                      marginHorizontal: 20
                    }]}
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                  />

                  <TouchableOpacity onPress={handleSignUp}>
                    <LinearGradient
                      colors={["#FF56F8", "#B6E300"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.inviteButton}
                    >
                      <Text style={styles.inviteButtonText}>NEXT</Text>
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
    marginTop: 40,
  },
  title: {
    fontSize: 24,
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

export default EmailScreen;
