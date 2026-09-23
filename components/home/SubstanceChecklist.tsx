import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SUBSTANCES } from "@/constants/app";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function SubstanceChecklist({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const colors = useColors();
  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item]);
  };
  return (
    <View style={styles.wrap}>
      {SUBSTANCES.map((item) => {
        const active = selected.includes(item);
        return (
          <TouchableOpacity
            key={item}
            onPress={() => toggle(item)}
            style={[
              styles.chip,
              { borderColor: colors.foreground, backgroundColor: active ? colors.foreground : "transparent" },
            ]}
          >
            <Text style={{ color: active ? colors.background : colors.foreground, fontSize: 12, fontFamily: fonts.bodyBold, letterSpacing: 0.6 }}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 10 },
});
