import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthenticatedUser } from "@/helpers/auth";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../assets/images/newLogo.svg";
import { inputStyle } from "@/helpers/styles";
import { useMainContext } from "@/helpers/context/mainContext";

export default function VerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { refreshAllData } = useMainContext();
  const { width } = Dimensions.get("window");

  const inputRefs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const isProductionEmail =
    (email as string).includes("kissorrug+prod") ||
    (email as string).includes("fka+prod");
  const boxSize = width * 0.12;

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index] = text;
      setOtp(updatedOtp);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (updatedOtp.every((value) => value.trim().length > 0)) {
        verifyOtp(updatedOtp.join(""));
      }
    }
  };

  const verifyOtp = async (otpCode: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string,
        token: otpCode,
        type: "email",
      });
      if (error) {
        Alert.alert("Verification Failed", error.message);
        resetOtpFields();
      } else if (data.session) {
        handleSuccessfulAuth(data.session.access_token, data.user?.id);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleSignInWithPassword = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password,
      });
      if (error) {
        Alert.alert("Sign In Failed", error.message);
      } else if (data.session) {
        handleSuccessfulAuth(data.session.access_token, data.user?.id);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleSuccessfulAuth = async (
    jwtToken: string,
    userId: string | undefined
  ) => {
    if (jwtToken && userId) {
      await AsyncStorage.setItem("jwtToken", jwtToken);
      const authorizedUser = await getAuthenticatedUser();
      await AsyncStorage.setItem("userId", authorizedUser.id);
      await refreshAllData();
      router.push(
        authorizedUser.onboarding_step === "completed"
          ? "/main/mainScreen"
          : "/NameInputScreen"
      );
    } else {
      Alert.alert("Error", "Could not retrieve session information");
    }
  };

  const resetOtpFields = () => {
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email as string,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        Alert.alert("Resend Failed", error.message);
      } else {
        Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
        setResendTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleNotYou = () => {
    router.back();
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.slice(0, 3) +
      "*".repeat(Math.max(0, username.length - 6)) +
      username.slice(-3);
    return `${maskedUsername}@${domain}`;
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

              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>
                    {isProductionEmail
                      ? "Enter Your Password"
                      : "Verify Your Email"}
                  </Text>

                  {!isProductionEmail && (
                    <View style={styles.emailInfoContainer}>
                      <Text style={styles.emailInfoText}>
                        OTP sent to {maskEmail(email as string)}
                      </Text>
                      <TouchableOpacity onPress={handleNotYou}>
                        <Text style={styles.notYouText}>Not you?</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {isProductionEmail ? (
                    <View style={styles.inputContainer}>
                      <TextInput
                        value={password}
                        placeholder="Enter your password"
                        style={[inputStyle, { width: "100%" }]}
                        placeholderTextColor="#666"
                        secureTextEntry
                        onChangeText={setPassword}
                      />

                      <TouchableOpacity onPress={handleSignInWithPassword}>
                        <LinearGradient
                          colors={["#FF56F8", "#B6E300"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.signInButton}
                        >
                          <Text style={styles.signInButtonText}>NEXT</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.boxContainer}>
                        {otp.map((value, index) => (
                          <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref!)}
                            style={[
                              styles.inputBox,
                              { width: boxSize, height: boxSize },
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            value={value}
                            onChangeText={(text) =>
                              handleOtpChange(text, index)
                            }
                            onKeyPress={({ nativeEvent }) => {
                              if (
                                nativeEvent.key === "Backspace" &&
                                value === ""
                              ) {
                                handleBackspace(index);
                              }
                            }}
                          />
                        ))}
                      </View>
                      {canResend ? (
                        <TouchableOpacity onPress={handleResendOtp}>
                          <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.timerText}>
                          Resend OTP in {resendTimer}s
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingVertical: 40,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
  },
  boxContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    color: "#313131",
  },
  inputContainer: {
    width: "100%",
  },
  signInButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signInButtonText: {
    color: "#313131",
    fontSize: 14,
    fontWeight: "600",
  },
  resendText: {
    color: "#313131",
    textAlign: "left",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  timerText: {
    color: "#666",
    textAlign: "left",
    marginTop: 20,
  },
  emailInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  emailInfoText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "WorkSans_400Regular",
  },
  notYouText: {
    fontSize: 14,
    color: "#313131",
    textDecorationLine: "underline",
    marginLeft: 10,
    fontFamily: "WorkSans_400Regular",
  },
});
