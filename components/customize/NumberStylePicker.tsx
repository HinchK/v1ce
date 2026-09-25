import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { NUMBER_STYLES } from "@/constants/coin";
import { useRouter } from "expo-router";
import { usePremium } from "@/context/PremiumContext";
import { fonts } from "@/constants/typography";

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
  "Big Shoulders Stencil": "BigShouldersStencilDisplayRegular",
  "Roboto Mono": "RobotoMono_700Bold",
  Oswald: "Oswald_600SemiBold",
  Raleway: "Raleway_700Bold",
  Fraunces: "Fraunces_700Bold",
  Caveat: "Caveat_400Regular",
  DynaPuff: "DynaPuff_600SemiBold",
};

const LABELS: Record<string, string> = {
  classic: "Classic",
  poppins: "Poppins",
  monospace: "Mono",
  fredoka: "Fredoka",
  serif: "Serif",
  dmsans: "Sans",
  courier: "Courier",
  bodoni: "Bodoni",
  syne: "Syne",
  pacifico: "Pacifico",
  bebas: "Bebas",
  inter: "Inter",
  big_shoulders_stencil: "Big Shoulders",
  roboto_mono: "Roboto Mono",
  oswald: "Oswald",
  raleway: "Raleway",
  fraunces: "Fraunces",
  caveat: "Caveat",
  dyna_puff: "DynaPuff",
};

const ORDER = [
  "big_shoulders_stencil", "roboto_mono", "oswald", "raleway", "fraunces", "caveat", "dyna_puff",
  "bebas", "bodoni", "courier", "classic", "poppins", "monospace", "fredoka", "serif", "dmsans", "syne", "pacifico", "inter",
] as const;

export default function NumberStylePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colors = useColors();
  const { isPremium } = usePremium();
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {ORDER.map((key) => {
        const style = NUMBER_STYLES[key];
        const locked = !["big_shoulders_stencil", "classic", "bebas", "bodoni"].includes(key) && !isPremium;
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => (locked ? router.push("/(tabs)/premium") : onChange(key))}
            style={[
              styles.card,
              { borderColor: active ? colors.foreground : colors.border },
              locked && { opacity: 0.42 },
            ]}
          >
            {locked ? (
              <Feather name="lock" size={12} color={colors.mutedForeground} style={styles.lock} />
            ) : null}
            <Text
              style={{
                color: colors.foreground,
                fontFamily: FONT_FAMILIES[style.fontFamily],
                fontSize: 42,
                lineHeight: 46,
              }}
            >
              42
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{LABELS[key] || key}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: {
    width: "31.4%",
    minHeight: 110,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  name: { fontSize: 12, fontFamily: fonts.body, marginTop: 4 },
  lock: { position: "absolute", right: 8, top: 8 },
});
