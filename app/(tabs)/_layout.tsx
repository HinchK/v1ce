import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>HOME</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="customize">
        <Icon sf={{ default: "circle", selected: "circle.fill" }} />
        <Label>COIN</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>STATS</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lounge">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>LOUNGE</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>FRIENDS</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>PROFILE</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="premium">
        <Icon sf={{ default: "star", selected: "star.fill" }} />
        <Label>PREMIUM</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const icon = (iosName: string, androidName: keyof typeof Feather.glyphMap) =>
    ({ color }: { color: string }) =>
      isIOS
        ? <SymbolView name={iosName} tintColor={color} size={24} />
        : <Feather name={androidName} size={22} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: "absolute",
          height: isWeb ? 84 : 72,
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "HOME", tabBarIcon: icon("house", "home") }} />
      <Tabs.Screen name="customize" options={{ title: "COIN", tabBarIcon: icon("circle", "circle") }} />
      <Tabs.Screen name="analytics" options={{ title: "STATS", tabBarIcon: icon("chart.bar", "bar-chart-2") }} />
      <Tabs.Screen name="lounge" options={{ title: "LOUNGE", tabBarIcon: icon("person.2", "users") }} />
      <Tabs.Screen name="friends" options={{ title: "FRIENDS", tabBarIcon: icon("person", "user") }} />
      <Tabs.Screen name="profile" options={{ title: "PROFILE", tabBarIcon: icon("gearshape", "settings") }} />
      <Tabs.Screen name="premium" options={{ title: "PREMIUM", tabBarIcon: icon("star", "star") }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <NativeTabLayout /> : <ClassicTabLayout />;
}
