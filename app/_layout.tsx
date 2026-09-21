import {Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold,useFonts} from "@expo-google-fonts/inter";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React,{useEffect} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthProvider} from "@/context/AuthContext";
import {ErrorBoundary} from "@/components/ErrorBoundary";
const queryClient=new QueryClient();
SplashScreen.preventAutoHideAsync();
export default function RootLayout(){const[loaded,error]=useFonts({Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold});useEffect(()=>{if(loaded||error)SplashScreen.hideAsync()},[loaded,error]);if(!loaded&&!error)return null;return <SafeAreaProvider><GestureHandlerRootView style={{flex:1}}><KeyboardProvider><QueryClientProvider client={queryClient}><ErrorBoundary><AuthProvider><Stack screenOptions={{headerShown:false}}/></AuthProvider></ErrorBoundary></QueryClientProvider></KeyboardProvider></GestureHandlerRootView></SafeAreaProvider>}