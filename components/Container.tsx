import React from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient colors={["#F4F9F5", "#EDDCCC"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
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
  content: {
    flex: 1,
  },
});

export default Container;
