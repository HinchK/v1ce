import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";

function ThemeHeader() {
  const c = useColors();
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: c.background, borderBottomColor: c.border }]}>
      <Text style={[styles.logo, { color: c.foreground }]}>V1CE</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onPress={toggleTheme}
        style={({ pressed }) => [
          styles.themeButton,
          {
            backgroundColor: c.foreground,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Feather name={isDark ? "sun" : "moon"} size={15} color={c.background} />
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  const c = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ThemeHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: c.gold,
          tabBarInactiveTintColor: c.mutedForeground,
          tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="customize" options={{ title: "Coin" }} />
        <Tabs.Screen name="analytics" options={{ title: "Stats" }} />
        <Tabs.Screen name="lounge" options={{ title: "Lounge" }} />
        <Tabs.Screen name="friends" options={{ title: "Friends" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="premium" options={{ title: "Premium" }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
  },
  logo: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 4,
  },
  themeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
