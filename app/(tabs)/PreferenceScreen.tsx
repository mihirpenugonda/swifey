import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../supabaseClient";
import HeaderLogo from "../../components/HeaderLogo";
import { updateUserProfile } from "@/services/apiService";
import Container from "@/components/Container";
import { LinearGradient } from "expo-linear-gradient";

export default function PreferenceScreen() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const router = useRouter();

  const preferences = ["Woman", "Man", "Non-Binary"];

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const handleNext = async () => {
    if (selectedPreferences.length === 0) {
      Alert.alert("Error", "Please select at least one preference.");
      return;
    }

    try {
      await updateUserProfile({
        gender_preference: selectedPreferences.map((p) => p.toLowerCase()),
      });

      router.push("/LocationAccessScreen");
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />

        <View style={{ flex: 1, paddingHorizontal: 20}}>
          <Text style={styles.title}>Who can Kiss or Rug you?</Text>

          {preferences.map((preference) => (
            <TouchableOpacity
              key={preference}
              style={[
                styles.optionContainer,
                selectedPreferences.includes(preference) &&
                  styles.selectedOptionContainer,
              ]}
              onPress={() => togglePreference(preference)}
            >
              <Text style={styles.optionText}>{preference}</Text>
              <View
                style={
                  selectedPreferences.includes(preference)
                    ? styles.selectedCircle
                    : styles.circle
                }
              >
                {selectedPreferences.includes(preference) && (
                  <Text style={styles.tick}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleNext}>
            <LinearGradient
              colors={["#FF56F8", "#B6E300"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: "#121515",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerLogoContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1111111A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  selectedOptionContainer: {
    backgroundColor: "#1111111A",
  },
  optionText: {
    color: "#313131",
    fontSize: 16,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#313131",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8F00FF",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
