import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LANGUAGES, useTranslation } from "@/lib/i18n";
import { useColors } from "@/hooks/useColors";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const colors = useColors();
  return (
    <View style={styles.row}>
      {LANGUAGES.map((item) => (
        <TouchableOpacity
          key={item.code}
          onPress={() => setLang(item.code)}
          style={[styles.chip, { borderColor: lang === item.code ? colors.foreground : colors.border }]}
        >
          <Text style={{ color: colors.foreground, fontSize: 10, fontWeight: "800" }}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderWidth: 2, paddingHorizontal: 8, paddingVertical: 6 },
});
