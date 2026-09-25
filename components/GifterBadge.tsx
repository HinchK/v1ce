import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function GifterBadge({ giftedCount = 0, size = "md" }: { giftedCount?: number; size?: "sm" | "md" | "lg" }) {
  const colors = useColors();
  if (!giftedCount) return null;
  const dim = size === "sm" ? 20 : size === "lg" ? 40 : 28;
  return (
    <View style={[styles.wrap, { width: dim, height: dim }]}>
      <Svg width={dim} height={dim} viewBox="0 0 24 24" style={StyleSheet.absoluteFill}>
        <Polygon points="12,2 15.09,10.26 24,10.26 17.55,15.7 20.09,24 12,19.54 3.91,24 6.45,15.7 0,10.26 8.91,10.26" fill={colors.foreground} />
      </Svg>
      <Text style={[styles.count, { color: colors.gold, fontSize: size === "lg" ? 14 : 11 }]}>{giftedCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  count: { fontFamily: fonts.bodyBold, zIndex: 1 },
});
