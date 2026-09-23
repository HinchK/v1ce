import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";
import ArcadeCabinet from "@/components/ui/ArcadeCabinet";

export default function Lounge() {
  const colors = useColors();
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.foreground }]}>THE{"\n"}ARCADE.</Text>
      <Text style={[styles.kicker, { color: colors.mutedForeground }]}>PLAY. SCORE. COMPETE.</Text>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/game")}>
        <ArcadeCabinet />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/game")} style={[styles.alt, { borderColor: colors.foreground }]}>
        <Text style={[styles.altTitle, { color: colors.foreground }]}>JAYWALKER</Text>
        <Text style={[styles.altSub, { color: colors.mutedForeground }]}>SNAKE · POWER-UPS</Text>
        <Text style={[styles.play, { color: colors.foreground }]}>PLAY →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },
  title: { fontSize: 64, lineHeight: 58, fontFamily: fonts.display, letterSpacing: 0.5 },
  kicker: { fontSize: 12, letterSpacing: 2.5, fontFamily: fonts.bodyBold, marginTop: 10 },
  alt: { marginTop: 28, borderWidth: 2, padding: 18 },
  altTitle: { fontSize: 22, fontFamily: fonts.display, letterSpacing: 1 },
  altSub: { fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1, marginTop: 4 },
  play: { fontFamily: fonts.extraBold, marginTop: 12, letterSpacing: 1 },
});
