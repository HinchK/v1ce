import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SUBSTANCES } from "@/constants/app";
import { useColors } from "@/hooks/useColors";

export default function SubstanceChecklist({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const colors = useColors();
  const [other, setOther] = useState("");
  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item]);
  };
  return (
    <View>
      <View style={styles.wrap}>
        {SUBSTANCES.map((item) => {
          const active = selected.includes(item);
          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggle(item)}
              style={[styles.chip, { borderColor: colors.foreground, backgroundColor: active ? colors.foreground : "transparent" }]}
            >
              <Text style={{ color: active ? colors.background : colors.foreground, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selected.includes("Other") ? (
        <TextInput
          value={other}
          onChangeText={setOther}
          placeholder="What else?"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.other, { borderColor: colors.foreground, color: colors.foreground }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 2, paddingHorizontal: 10, paddingVertical: 9 },
  other: { borderWidth: 2, padding: 12, marginTop: 12, fontSize: 14 },
});
