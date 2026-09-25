import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

const STYLES = ["arcade", "lofi", "synth"] as const;

export default function BirthdayStylePicker({
  value,
  onChange,
  postToLounge,
  onTogglePost,
}: {
  value: string;
  onChange: (value: string) => void;
  postToLounge: boolean;
  onTogglePost: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {STYLES.map((style) => (
          <TouchableOpacity
            key={style}
            onPress={() => onChange(style)}
            style={[styles.chip, { borderColor: colors.foreground, backgroundColor: value === style ? colors.foreground : "transparent" }]}
          >
            <Text style={{ color: value === style ? colors.background : colors.foreground, fontFamily: fonts.bodyBold, letterSpacing: 1 }}>
              {style.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={onTogglePost}>
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.bodyBold }}>
          {postToLounge ? "POST TO LOUNGE: ON" : "POST TO LOUNGE: OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, marginTop: 12 },
  row: { flexDirection: "row", gap: 8 },
  chip: { flex: 1, borderWidth: 2, paddingVertical: 10, alignItems: "center" },
});
