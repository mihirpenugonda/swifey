import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { WorkSans_700Bold } from "@expo-google-fonts/work-sans";
import {
  Tomorrow_400Regular,
  Tomorrow_700Bold,
} from "@expo-google-fonts/tomorrow";

import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient"; // Corrected import
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    WorkSans_700Bold,
    Tomorrow_400Regular,
    Tomorrow_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const gradientColors = ["#F4F9F5", "#EDDCCC"];

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </LinearGradient>
    </ThemeProvider>
  );
}
