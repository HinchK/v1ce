import {
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
} from "@expo-google-fonts/inter";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { BodoniModa_700Bold } from "@expo-google-fonts/bodoni-moda";
import { Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import { CourierPrime_700Bold } from "@expo-google-fonts/courier-prime";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { Fredoka_400Regular } from "@expo-google-fonts/fredoka";
import { IBMPlexSerif_700Bold } from "@expo-google-fonts/ibm-plex-serif";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { SpaceMono_700Bold } from "@expo-google-fonts/space-mono";
import { Syne_700Bold } from "@expo-google-fonts/syne";
import { RobotoMono_700Bold } from "@expo-google-fonts/roboto-mono";
import { Arimo_700Bold } from "@expo-google-fonts/arimo";
import { Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Saira_700Bold } from "@expo-google-fonts/saira";
import { JosefinSans_600SemiBold } from "@expo-google-fonts/josefin-sans";
import { Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import { DynaPuff_600SemiBold } from "@expo-google-fonts/dyna-puff";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function RootNavigation() {
  const { isLoading, profile } = useAuth();
  if (isLoading) return null;
  if (!profile?.sobriety_date) return <Redirect href="/onboarding" />;
  return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="game" /><Stack.Screen name="widget" /><Stack.Screen name="coin-widget" /></Stack>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
    BebasNeue_400Regular, BodoniModa_700Bold, Cinzel_700Bold, CourierPrime_700Bold,
    DMSans_700Bold, Fredoka_400Regular, IBMPlexSerif_700Bold, Pacifico_400Regular,
    Poppins_700Bold, SpaceMono_700Bold, Syne_700Bold,
    RobotoMono_700Bold, Arimo_700Bold, Oswald_600SemiBold, Raleway_700Bold, Saira_700Bold,
    JosefinSans_600SemiBold, Fraunces_700Bold, Caveat_400Regular, DynaPuff_600SemiBold,
    BigShouldersStencilDisplayRegular: require("../assets/fonts/BigShouldersStencilDisplay-Regular.ttf"),
    SedgwickAveDisplayRegular: require("../assets/fonts/SedgwickAveDisplay-Regular.ttf"),
    RobotoMonoWidget: require("../assets/fonts/native/RobotoMono-Variable.ttf"),
    ArimoWidget: require("../assets/fonts/native/Arimo-Variable.ttf"),
    OswaldWidget: require("../assets/fonts/native/Oswald-Variable.ttf"),
    RalewayWidget: require("../assets/fonts/native/Raleway-Variable.ttf"),
    SairaWidget: require("../assets/fonts/native/Saira-Variable.ttf"),
    EduQLDHandWidget: require("../assets/fonts/native/EduQLDHand-Variable.ttf"),
    JosefinSansWidget: require("../assets/fonts/native/JosefinSans-Variable.ttf"),
    FrauncesWidget: require("../assets/fonts/native/Fraunces-Variable.ttf"),
    CaveatWidget: require("../assets/fonts/native/Caveat-Regular.ttf"),
    GeistPixelWidget: require("../assets/fonts/native/GeistPixel-Variable.ttf"),
    DynaPuffWidget: require("../assets/fonts/native/DynaPuff-Variable.ttf"),
  });

  useEffect(() => { if (loaded || error) SplashScreen.hideAsync(); }, [loaded, error]);
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <AuthProvider>
                <RootNavigation />
              </AuthProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
