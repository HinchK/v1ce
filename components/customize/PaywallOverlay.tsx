import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function PaywallOverlay({ children }: { children?: React.ReactNode }) {
  const colors = useColors();
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {children}
      <View style={[styles.overlay, { backgroundColor: colors.background + "CC" }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Unlock Customization</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Personalize your coin with custom shapes, colors, and number styles
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/premium")} style={[styles.button, { backgroundColor: colors.foreground }]}>
            <Text style={{ color: colors.background, fontWeight: "800" }}>Upgrade to Premium</Text>
          </TouchableOpacity>
          <Text style={[styles.note, { color: colors.mutedForeground }]}>One-time purchase</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", padding: 16 },
  card: { borderWidth: 1, padding: 18, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  body: { fontSize: 13, textAlign: "center", marginBottom: 14 },
  button: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  note: { fontSize: 11, marginTop: 8 },
});
