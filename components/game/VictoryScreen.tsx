import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function VictoryScreen({
  score,
  onRetry,
  onShare,
}: {
  score: number;
  onRetry: () => void;
  onShare?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.wrap, { backgroundColor: "#000" }]}>
      <Text style={styles.green}>YOU SURVIVED.</Text>
      <Text style={styles.white}>PASS THE STRENGTH ON.</Text>
      <Text style={styles.green}>FINAL SCORE: {score}</Text>
      <TouchableOpacity onPress={onShare} style={styles.outline}>
        <Text style={styles.white}>SHARE WITH A FRIEND</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRetry} style={styles.button}>
        <Text style={{ color: "#000", fontFamily: fonts.black }}>RETRY →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: "center", gap: 10, borderWidth: 2, borderColor: "#fff" },
  green: { color: "#00E676", fontFamily: "SpaceMono_700Bold", fontSize: 16 },
  white: { color: "#fff", fontFamily: "SpaceMono_700Bold", fontSize: 11 },
  outline: { borderWidth: 1, borderColor: "#fff", padding: 10, marginTop: 8 },
  button: { backgroundColor: "#00E676", paddingHorizontal: 20, paddingVertical: 12, marginTop: 8 },
});
