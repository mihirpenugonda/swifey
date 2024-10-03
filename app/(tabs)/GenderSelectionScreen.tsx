import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../../components/HeaderLogo";
import { updateUserProfile } from "@/services/apiService";
import Container from "@/components/Container";

export default function GenderSelectionScreen() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const router = useRouter();

  const handleGenderSelect = async (gender: string) => {
    setSelectedGender(gender);
    try {
      await updateUserProfile({
        gender: gender.toLowerCase(),
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
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text style={styles.title}>What's your gender?</Text>

          {["Woman", "Man", "Non-Binary"].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.optionContainer,
                selectedGender === gender && styles.selectedOptionContainer,
              ]}
              onPress={() => handleGenderSelect(gender)}
            >
              <Text style={styles.optionText}>{gender}</Text>
              <View
                style={
                  selectedGender === gender
                    ? styles.selectedCircle
                    : styles.circle
                }
              >
                {selectedGender === gender && (
                  <Text style={styles.tick}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
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
});
