import {Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold,useFonts} from "@expo-google-fonts/inter";
import {Cinzel_700Bold} from "@expo-google-fonts/cinzel";
import {Poppins_700Bold} from "@expo-google-fonts/poppins";
import {SpaceMono_700Bold} from "@expo-google-fonts/space-mono";
import {Fredoka_400Regular} from "@expo-google-fonts/fredoka";
import {IBMPlexSerif_700Bold} from "@expo-google-fonts/ibm-plex-serif";
import {DMSans_700Bold} from "@expo-google-fonts/dm-sans";
import {CourierPrime_700Bold} from "@expo-google-fonts/courier-prime";
import {BodoniModa_700Bold} from "@expo-google-fonts/bodoni-moda";
import {Syne_700Bold} from "@expo-google-fonts/syne";
import {Pacifico_400Regular} from "@expo-google-fonts/pacifico";
import {BebasNeue_400Regular} from "@expo-google-fonts/bebas-neue";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {Stack} from "expo-router";
import React from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthProvider} from "@/context/AuthContext";
import {ErrorBoundary} from "@/components/ErrorBoundary";

const queryClient=new QueryClient();

export default function RootLayout(){
 useFonts({Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold,Cinzel_700Bold,Poppins_700Bold,SpaceMono_700Bold,Fredoka_400Regular,IBMPlexSerif_700Bold,DMSans_700Bold,CourierPrime_700Bold,BodoniModa_700Bold,Syne_700Bold,Pacifico_400Regular,BebasNeue_400Regular});
 return <SafeAreaProvider><GestureHandlerRootView style={{flex:1}}><QueryClientProvider client={queryClient}><ErrorBoundary><AuthProvider><Stack screenOptions={{headerShown:false}}/></AuthProvider></ErrorBoundary></QueryClientProvider></GestureHandlerRootView></SafeAreaProvider>;
}