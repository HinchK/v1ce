import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import AppChrome from "@/components/layout/AppChrome";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center" }}>
      <View style={{ flex: 1, width: "100%", maxWidth: 430 }}>
        <Tabs
          tabBar={() => null}
          screenOptions={{
            header: () => <AppChrome />,
            headerStatusBarHeight: 0,
            sceneStyle: { backgroundColor: colors.background },
            animation: Platform.OS === "web" ? "none" : "fade",
          }}
        >
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="customize" options={{ title: "Customize" }} />
          <Tabs.Screen name="lounge" options={{ title: "Lounge" }} />
          <Tabs.Screen name="friends" options={{ title: "Friends" }} />
          <Tabs.Screen name="share" options={{ title: "Share" }} />
          <Tabs.Screen name="analytics" options={{ href: null, title: "Stats" }} />
          <Tabs.Screen name="profile" options={{ href: null, title: "Profile" }} />
          <Tabs.Screen name="premium" options={{ href: null, title: "Premium" }} />
        </Tabs>
      </View>
    </View>
  );
}
