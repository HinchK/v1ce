import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function DrawShapePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (path: string) => void;
}) {
  const colors = useColors();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const addPoint = (x: number, y: number) => {
    const next = [...points, { x: Math.round(x), y: Math.round(y) }].slice(0, 16);
    setPoints(next);
    onChange(next.map((p) => `${p.x},${p.y}`).join(" "));
  };

  return (
    <View>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: fonts.body, marginBottom: 8 }}>
        Tap the pad to draw a custom polygon for your coin.
      </Text>
      <View
        onStartShouldSetResponder={() => true}
        onResponderRelease={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          addPoint((locationX / 320) * 100, (locationY / 180) * 100);
        }}
        style={[styles.pad, { borderColor: colors.foreground, backgroundColor: colors.card }]}
      >
        {points.map((p, i) => (
          <View key={i} style={[styles.dot, { left: (p.x / 100) * 320 - 4, top: (p.y / 100) * 180 - 4, backgroundColor: colors.foreground }]} />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => {
          setPoints([]);
          onChange("");
        }}
      >
        <Text style={{ color: colors.mutedForeground, fontFamily: fonts.bodyBold, marginTop: 8, letterSpacing: 1 }}>CLEAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { height: 180, borderWidth: 2, borderStyle: "dashed", position: "relative", overflow: "hidden" },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
});
