import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

const PROMPTS = [
  "Happy birthday — proud of you.",
  "Another trip around the sun, still showing up.",
  "Celebrate the days you already won.",
];

export default function BirthdayPrompts({ onSelect }: { onSelect: (text: string) => void }) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      {PROMPTS.map((prompt) => (
        <TouchableOpacity
          key={prompt}
          onPress={() => onSelect(prompt)}
          style={[styles.chip, { borderColor: colors.foreground }]}
        >
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700" }}>{prompt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginTop: 12 },
  chip: { borderWidth: 2, padding: 12 },
});
