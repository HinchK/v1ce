import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import SnakeGame from "@/components/games/SnakeGame";
import GameLeaderboard from "@/components/game/GameLeaderboard";
import { fonts } from "@/constants/typography";

export default function Game() {
  const c = useColors();
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={s.page}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[s.back, { color: c.foreground }]}>← BACK</Text>
      </TouchableOpacity>
      <Text style={[s.kicker, { color: c.mutedForeground }]}>V1CE</Text>
      <Text style={[s.title, { color: c.foreground }]}>SNAKE.</Text>
      <SnakeGame />
      <GameLeaderboard />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, paddingTop: 40, paddingBottom: 80 },
  back: { fontSize: 11, fontFamily: fonts.black, letterSpacing: 2, marginBottom: 30 },
  kicker: { fontSize: 11, letterSpacing: 5, fontFamily: fonts.bodyBold },
  title: { fontSize: 54, fontFamily: fonts.display, marginBottom: 22 },
});
