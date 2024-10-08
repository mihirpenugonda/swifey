import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import HeaderLogo from "../../components/HeaderLogo";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/services/apiService";
import Container from "@/components/Container";
import { inputStyle } from "@/helpers/styles";

export default function BirthdayInputScreen() {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [isOver18, setIsOver18] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (currentDate) {
      setDate(currentDate);
      setIsOver18(calculateAge(currentDate) >= 18);
    }
  };

  const calculateAge = (birthdate: Date) => {
    const diffMs = Date.now() - birthdate.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const handleConfirm = async () => {
    if (date && isOver18) {
      try {
        await updateUserProfile({
          date_of_birth: date.toISOString(),
        });

        router.push("/AddPhotosScreen");
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <HeaderLogo />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>When's your Birthday?</Text>

          <TouchableOpacity
            style={[inputStyle, styles.buttonWidth]}
          >
            <Text style={styles.dateText}>
              {date ? date.toDateString() : "Select your birth date"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.buttonWrapper}
            disabled={!isOver18}
          >
            <LinearGradient
              colors={ ["#FF56F8", "#B6E300"] }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                { opacity: isOver18 ? 1 : 0.5 },
                styles.gradientButton,
                isOver18 ? styles.buttonEnabled : styles.buttonDisabled,
              ]}
            >
              <Text style={[styles.buttonText, !isOver18 && styles.disabledText]}>
                {date
                  ? `I confirm that I am ${calculateAge(date)} years old`
                  : "PLEASE SELECT YOUR BIRTH DATE"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
          style={styles.datePicker}
          textColor="#000000"
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "WorkSans_700Bold",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
  },
  dateText: {
    color: "#313131",
  },
  buttonWidth: {
    width: "100%",
  },
  buttonWrapper: {
    width: "100%",
  },
  gradientButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonEnabled: {
    opacity: 1,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  disabledText: {
    color: "#666666",
  },
  datePickerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  datePickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#EDDCCC10",
  },
});
