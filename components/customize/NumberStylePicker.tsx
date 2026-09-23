import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { NUMBER_STYLES } from "@/constants/coin";
import { useRouter } from "expo-router";
import { usePremium } from "@/context/PremiumContext";

const FONT_FAMILIES: Record<string, string> = {
  Cinzel: "Cinzel_700Bold",
  Poppins: "Poppins_700Bold",
  "Space Mono": "SpaceMono_700Bold",
  "Fredoka One": "Fredoka_400Regular",
  "IBM Plex Serif": "IBMPlexSerif_700Bold",
  "DM Sans": "DMSans_700Bold",
  "Courier Prime": "CourierPrime_700Bold",
  "Bodoni Moda": "BodoniModa_700Bold",
  Syne: "Syne_700Bold",
  Pacifico: "Pacifico_400Regular",
  "Bebas Neue": "BebasNeue_400Regular",
  Inter: "Inter_700Bold",
};

export default function NumberStylePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colors = useColors();
  const { isPremium } = usePremium();
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {Object.entries(NUMBER_STYLES).map(([key, style]) => {
        const locked = key !== "classic" && !isPremium;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => (locked ? router.push("/(tabs)/premium") : onChange(key))}
            style={[styles.option, { borderColor: value === key ? colors.foreground : colors.border, opacity: locked ? 0.5 : 1 }]}
          >
            <Text style={{ color: colors.foreground, fontFamily: FONT_FAMILIES[style.fontFamily], fontSize: 16 }}>{key.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 12, minWidth: 105 },
});
