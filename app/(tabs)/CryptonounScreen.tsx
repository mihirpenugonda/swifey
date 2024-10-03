import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../supabaseClient";
import HeaderLogo from "../../components/HeaderLogo";
import { LinearGradient } from "expo-linear-gradient";
import { updateUserProfile } from "@/services/apiService";

export default function CryptonounScreen() {
  const [selectedCryptonoun, setSelectedCryptonoun] = useState<string | null>(
    null
  );
  const [customCryptonoun, setCustomCryptonoun] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    const keyboardWillShow = (event: {
      duration: any;
      endCoordinates: { height: any };
    }) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || 300,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: { duration: any }) => {
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

  const handleCryptonounSelect = async (cryptonoun: string) => {
    setSelectedCryptonoun(cryptonoun);
    setLoading(true);
    try {
      await updateUserProfile({
        cryptonoun: cryptonoun,
      });

      router.push("/PreferenceScreen");
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomCryptonounSubmit = () => {
    if (customCryptonoun.trim()) {
      handleCryptonounSelect(customCryptonoun.trim());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[styles.container, { paddingBottom: keyboardHeight }]}
      >
        <View style={styles.headerLogoContainer}>
          <HeaderLogo />
        </View>

        <Text style={styles.title}>What’s your CryptoNouns?</Text>

        <ScrollView style={styles.scrollView}>
          {[
            "Bitcoin puppets",
            "Wassie",
            "Pepe",
            "Jirasan",
            "Pudgies",
            "World of women",
          ].map((cryptonoun) => (
            <TouchableOpacity
              key={cryptonoun}
              style={[
                styles.optionContainer,
                selectedCryptonoun === cryptonoun &&
                  styles.selectedOptionContainer,
              ]}
              onPress={() => handleCryptonounSelect(cryptonoun)}
            >
              <Text style={styles.optionText}>{cryptonoun}</Text>
              <View
                style={
                  selectedCryptonoun === cryptonoun
                    ? styles.selectedCircle
                    : styles.circle
                }
              >
                {selectedCryptonoun === cryptonoun && (
                  <Text style={styles.tick}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your CryptoNouns"
              placeholderTextColor="#666"
              value={customCryptonoun}
              onChangeText={setCustomCryptonoun}
            />

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleCustomCryptonounSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={["#FF56F8", "#B6E300"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Saving..." : "Next"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121515",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingVertical: 40,
  },
  headerLogoContainer: {},
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "left",
  },
  scrollView: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  selectedOptionContainer: {
    backgroundColor: "#444",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF56F8",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customInputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: "100%",
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
});
