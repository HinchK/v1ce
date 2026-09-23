import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SHAPES } from "@/components/CoinFront";
import { usePremium } from "@/context/PremiumContext";
import { useColors } from "@/hooks/useColors";

const ALL_SHAPES = [...SHAPES, "drawn"] as const;
const COMING_SOON = ["heart", "infinity", "moon", "leaf", "flame"];

export default function ShapePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colors = useColors();
  const { isPremium } = usePremium();
  const router = useRouter();
  return (
    <View>
      <View style={styles.wrap}>
        {ALL_SHAPES.map((item) => {
          const locked = item !== "circle" && !isPremium;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => (locked ? router.push("/(tabs)/premium") : onChange(item))}
              style={[styles.option, { borderColor: value === item ? colors.foreground : colors.border, opacity: locked ? 0.5 : 1 }]}
            >
              <Text style={{ color: colors.foreground, fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>{item.toUpperCase()}</Text>
              {locked ? <Text style={{ color: colors.mutedForeground, fontSize: 8, fontWeight: "800" }}>PREMIUM</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[styles.wrap, { marginTop: 10, opacity: 0.45 }]}>
        {COMING_SOON.map((item) => (
          <View key={item} style={[styles.option, { borderColor: colors.border }]}>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: "900" }}>{item.toUpperCase()}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 8 }}>SOON</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderWidth: 2, paddingHorizontal: 11, paddingVertical: 10, minWidth: 84 },
});
