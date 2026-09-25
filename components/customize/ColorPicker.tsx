import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { COLOR_SWATCHES } from "@/constants/app";
import { fonts } from "@/constants/typography";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const colors = useColors();
  const [customHex, setCustomHex] = useState(/^#[0-9A-Fa-f]{6}$/.test(value) ? value.toUpperCase() : "");

  useEffect(() => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) setCustomHex(value.toUpperCase());
  }, [value]);

  return (
    <View>
      <View style={styles.wrap}>
        {COLOR_SWATCHES.map((hex) => (
          <TouchableOpacity
            key={hex}
            accessibilityLabel={`Select color ${hex}`}
            onPress={() => onChange(hex)}
            style={[styles.swatch, { backgroundColor: hex, borderColor: value.toUpperCase() === hex ? colors.foreground : colors.border }]}
          />
        ))}
      </View>
      <View style={styles.custom}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>CUSTOM COLOR · HEX</Text>
        <View style={styles.customRow}>
          <View
            style={[
              styles.preview,
              {
                backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(customHex) ? customHex : colors.card,
                borderColor: colors.foreground,
              },
            ]}
          />
          <TextInput
            value={customHex}
            onChangeText={(input) => {
              const normalized = input.startsWith("#") ? input : `#${input}`;
              const next = normalized.replace(/[^#0-9A-Fa-f]/g, "").slice(0, 7).toUpperCase();
              setCustomHex(next);
              if (/^#[0-9A-Fa-f]{6}$/.test(next)) onChange(next);
            }}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
            placeholder="#F5D680"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.foreground, backgroundColor: colors.card }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  swatch: { width: 36, height: 36, borderWidth: 2 },
  custom: { marginTop: 20 },
  label: { fontSize: 10, fontFamily: fonts.bodyBold, letterSpacing: 2, marginBottom: 8 },
  customRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  preview: { width: 44, height: 44, borderWidth: 2 },
  input: { flex: 1, height: 44, borderWidth: 2, paddingHorizontal: 12, fontFamily: fonts.body, fontSize: 14 },
});
