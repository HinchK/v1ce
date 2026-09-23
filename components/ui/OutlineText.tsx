import React from "react";
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";

const OFFSETS = [
  [-1.2, 0],
  [1.2, 0],
  [0, -1.2],
  [0, 1.2],
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
] as const;

export default function OutlineText({
  children,
  fill,
  stroke,
  style,
}: {
  children: string;
  fill: string;
  stroke: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View>
      {OFFSETS.map(([x, y], i) => (
        <Text key={i} style={[style, styles.abs, { color: stroke, left: x, top: y }]}>
          {children}
        </Text>
      ))}
      <Text style={[style, { color: fill }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute" },
});
