import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function MiniColorInput({
  value,
  onChange,
  placeholder = "AUTO",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const colors = useColors();
  const swatch = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "transparent";
  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { borderColor: colors.foreground, backgroundColor: swatch }]} />
      <TextInput
        value={value}
        onChangeText={(next) => {
          const v = next.startsWith("#") || next === "" ? next : `#${next}`;
          onChange(v.slice(0, 7).toUpperCase());
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="characters"
        maxLength={7}
        style={[styles.input, { color: colors.foreground, borderBottomColor: colors.foreground }]}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChange("")}>
          <Text style={[styles.auto, { color: colors.mutedForeground }]}>AUTO</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2 },
  input: {
    flex: 1,
    borderBottomWidth: 2,
    paddingVertical: 8,
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: fonts.body,
    textTransform: "uppercase",
  },
  auto: { fontSize: 10, letterSpacing: 2, fontFamily: fonts.bodyBold },
});
