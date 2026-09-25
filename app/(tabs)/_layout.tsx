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
        <Label>CUSTOMIZE</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lounge">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>LOUNGE</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>FRIENDS</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="share">
        <Icon sf={{ default: "square.and.arrow.up", selected: "square.and.arrow.up.fill" }} />
        <Label>SHARE</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const icon = (iosName: React.ComponentProps<typeof SymbolView>["name"], androidName: keyof typeof Feather.glyphMap) =>
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
      <Tabs.Screen name="customize" options={{ title: "CUSTOMIZE", tabBarIcon: icon("circle", "circle") }} />
      <Tabs.Screen name="lounge" options={{ title: "LOUNGE", tabBarIcon: icon("person.2", "users") }} />
      <Tabs.Screen name="friends" options={{ title: "FRIENDS", tabBarIcon: icon("person", "user") }} />
      <Tabs.Screen name="share" options={{ title: "SHARE", tabBarIcon: icon("square.and.arrow.up", "share") }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="premium" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <NativeTabLayout /> : <ClassicTabLayout />;
}
