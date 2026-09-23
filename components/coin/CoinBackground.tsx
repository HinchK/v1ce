import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type Props = { kind?: string; size?: number; color?: string };

export function CoinBackground({ kind = "solid", size = 100, color = "#F5D680" }: Props) {
  if (!kind || kind === "solid") return null;
  const s = 100;
  if (kind === "zebra") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {[0, 12, 24, 36, 48, 60, 72, 84].map((y) => (
          <Rect key={y} x="0" y={y} width={s} height="7" fill="#0A0A0A" opacity={0.18} />
        ))}
      </Svg>
    );
  }
  if (kind === "leopard") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {[[18, 20], [40, 16], [70, 28], [30, 48], [58, 52], [78, 70], [22, 74], [48, 80]].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={7} fill="#0A0A0A" opacity={0.22} />
        ))}
      </Svg>
    );
  }
  if (kind === "space") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect width="100" height="100" fill="#0A0A0A" opacity={0.35} />
        {[[12, 18], [40, 12], [70, 22], [88, 40], [20, 55], [55, 48], [78, 72], [30, 80], [60, 88]].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={i % 2 ? 1.2 : 2} fill="#FFFFFF" />
        ))}
      </Svg>
    );
  }
  if (kind === "lightning") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M55 8 L32 48 L48 48 L40 92 L72 42 L54 42 Z" fill={color === "#F5D680" ? "#0A0A0A" : "#FFFFFF"} opacity={0.2} />
      </Svg>
    );
  }
  if (kind === "slime") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M10 70 Q30 40 50 70 T90 70 L90 100 L10 100 Z" fill="#7CFC00" opacity={0.28} />
      </Svg>
    );
  }
  if (kind === "flames") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 100 Q30 50 40 100 Q50 40 60 100 Q70 55 80 100 Z" fill="#FF6B00" opacity={0.35} />
      </Svg>
    );
  }
  if (kind === "hotpink") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect width="100" height="100" fill="#FF2D95" opacity={0.28} />
      </Svg>
    );
  }
  return null;
}
