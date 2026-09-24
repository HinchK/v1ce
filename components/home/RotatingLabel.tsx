import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "@/lib/i18n";
import { fonts } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import OutlineText from "@/components/ui/OutlineText";
import { Text } from "react-native";

export default function RotatingLabel() {
  const colors = useColors();
  const { t, tList } = useTranslation();
  const words = tList("home.rotatingWords");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (words.length === 0) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % words.length), 1600);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, marginTop: 2 }}>
      <Text
        style={{
          color: colors.foreground,
          fontSize: 28,
          lineHeight: 30,
          fontFamily: fonts.italic,
          letterSpacing: 1.5,
          fontStyle: "italic",
        }}
      >
        {t("home.daysLabel")}
      </Text>
      <OutlineText
        fill={colors.background}
        stroke={colors.foreground}
        style={{
          fontSize: 28,
          lineHeight: 30,
          fontFamily: fonts.italicBlack,
          letterSpacing: 0.5,
          fontStyle: "italic",
        }}
      >
        {words[index] || ""}
      </OutlineText>
    </View>
  );
}
