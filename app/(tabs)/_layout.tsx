import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><Icon sf={{ default: "house", selected: "house.fill" }} /><Label>Home</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="customize"><Icon sf={{ default: "circle", selected: "circle.fill" }} /><Label>Coin</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics"><Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} /><Label>Stats</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="lounge"><Icon sf={{ default: "person.2", selected: "person.2.fill" }} /><Label>Lounge</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends"><Icon sf={{ default: "person", selected: "person.fill" }} /><Label>Friends</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile"><Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} /><Label>Profile</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="premium"><Icon sf={{ default: "star", selected: "star.fill" }} /><Label>Premium</Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";
  const isIOS = Platform.OS === "ios";
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isIOS ? "transparent" : colors.background,
            borderTopColor: colors.border,
          },
        ],
        tabBarBackground: isIOS ? () => (
          <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        ) : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="house" tintColor={color} size={24} /> : <Feather name="home" size={22} color={color} /> }} />
      <Tabs.Screen name="customize" options={{ title: "Coin", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="circle" tintColor={color} size={24} /> : <Feather name="circle" size={22} color={color} /> }} />
      <Tabs.Screen name="analytics" options={{ title: "Stats", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="chart.bar" tintColor={color} size={24} /> : <Feather name="bar-chart-2" size={22} color={color} /> }} />
      <Tabs.Screen name="lounge" options={{ title: "Lounge", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person.2" tintColor={color} size={24} /> : <Feather name="users" size={22} color={color} /> }} />
      <Tabs.Screen name="friends" options={{ title: "Friends", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person" tintColor={color} size={24} /> : <Feather name="user-plus" size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="gearshape" tintColor={color} size={24} /> : <Feather name="settings" size={22} color={color} /> }} />
      <Tabs.Screen name="premium" options={{ title: "Premium", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="star" tintColor={color} size={24} /> : <Feather name="star" size={22} color={color} /> }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  tabBar: { height: 72, paddingTop: 6, paddingBottom: 8 },
});
