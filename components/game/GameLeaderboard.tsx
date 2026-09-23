import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

const MOCK = [
  { name: "YOU", score: 0, medal: "—" },
  { name: "JAY", score: 4200, medal: "🥇" },
  { name: "RIN", score: 3100, medal: "🥈" },
  { name: "MO", score: 1800, medal: "🥉" },
];

export default function GameLeaderboard({ score = 0 }: { score?: number }) {
  const colors = useColors();
  const rows = MOCK.map((row) => (row.name === "YOU" ? { ...row, score } : row)).sort((a, b) => b.score - a.score);
  return (
    <View style={[styles.wrap, { borderColor: colors.foreground }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>LEADERBOARD</Text>
      {rows.map((row) => (
        <View key={row.name} style={styles.row}>
          <Text style={{ color: colors.foreground, width: 28 }}>{row.medal}</Text>
          <Text style={{ color: colors.foreground, flex: 1, fontWeight: "800" }}>{row.name}</Text>
          <Text style={{ color: colors.mutedForeground, fontWeight: "700" }}>{row.score}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 2, padding: 14, marginTop: 16 },
  title: { fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 10 },
  row: { flexDirection: "row", paddingVertical: 6 },
});
