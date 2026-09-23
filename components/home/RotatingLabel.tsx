import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ROTATING_WORDS } from "@/constants/app";
import { fonts } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import OutlineText from "@/components/ui/OutlineText";
import { Text } from "react-native";

export default function RotatingLabel() {
  const colors = useColors();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((value) => (value + 1) % ROTATING_WORDS.length), 1600);
    return () => clearInterval(id);
  }, []);
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
        DAYS
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
        {ROTATING_WORDS[index]}
      </OutlineText>
    </View>
  );
}
