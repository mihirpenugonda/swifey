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
import HeaderLogo from "../../components/HeaderLogo";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserProfile } from "@/services/apiService";
import Container from "@/components/Container";
import { inputStyle } from "@/helpers/styles";

export default function NameInputScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));

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

  const handleNameSubmit = async () => {
    if (name.trim().length === 0) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");

      console.log(token, "token");

      await updateUserProfile({
        name: name,
      });

      router.push("/BirthdayInputScreen");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>What's your name?</Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleNameSubmit}
          />
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleNameSubmit}
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
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
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
    marginTop: 20,
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
