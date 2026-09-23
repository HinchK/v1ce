import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

const COLORS = ["#F5A41A", "#0A0A0A", "#FFFFFF", "#FF2D95", "#00E676"];

export default function BirthdayConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: i * 40,
        color: COLORS[i % COLORS.length],
        size: 6 + (i % 4) * 2,
      })),
    []
  );
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 80);
    return () => clearInterval(id);
  }, []);
  const t = Date.now();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const y = ((t / 12 + p.delay) % 360);
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
          />
        );
      })}
    </View>
  );
}
