import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { inputStyle } from "@/helpers/styles";

import Logo from "../../assets/images/newLogo.svg";
import { supabase } from "../../supabaseClient";
import { useRouter } from "expo-router";

const EmailScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    const keyboardWillShow = (event: {
      duration: number;
      endCoordinates: { height: number };
    }) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || 300,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: { duration: number }) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || 300,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSignUp = async () => {
    if (isCooldown) {
      Alert.alert(
        "Please wait",
        "You need to wait a few minutes before requesting again."
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

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
    <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>What's your email address?</Text>
        <View style={{ gap: 10 }}>
          <TextInput
            value={email}
            placeholder="Enter your email"
            style={inputStyle}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
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
