import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BACKGROUNDS } from "@/constants/app";
import { useColors } from "@/hooks/useColors";
import { CoinBackground } from "@/components/coin/CoinBackground";

export default function BackgroundPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      {BACKGROUNDS.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onChange(item)}
          style={[styles.option, { borderColor: value === item ? colors.foreground : colors.border }]}
        >
          <View style={styles.preview}>
            <CoinBackground kind={item} size={36} />
          </View>
          <Text style={{ color: colors.foreground, fontSize: 9, fontWeight: "800", letterSpacing: 1 }}>{item.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderWidth: 2, padding: 8, minWidth: 84, alignItems: "center", gap: 6 },
  preview: { width: 36, height: 36, overflow: "hidden" },
});
