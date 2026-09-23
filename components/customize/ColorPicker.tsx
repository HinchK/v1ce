import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { COLOR_SWATCHES } from "@/constants/app";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      {COLOR_SWATCHES.map((hex) => (
        <TouchableOpacity
          key={hex}
          onPress={() => onChange(hex)}
          style={[styles.swatch, { backgroundColor: hex, borderColor: value.toUpperCase() === hex ? colors.foreground : colors.border }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  swatch: { width: 36, height: 36, borderWidth: 2 },
});
