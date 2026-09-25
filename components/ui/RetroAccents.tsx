import React from "react";
import Svg, { Circle, Line, Path, Polygon } from "react-native-svg";

type AccentProps = { size?: number; color?: string; opacity?: number };

export function Starburst({ size = 64, color = "#0A0A0A", opacity = 0.08 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Polygon
        fill={color}
        points="50,4 54.14,34.55 73,10.16 61.31,38.69 89.84,27 65.45,45.86 96,50 65.45,54.14 89.84,73 61.31,61.31 73,89.84 54.14,65.45 50,96 45.86,65.45 27,89.84 38.69,61.31 10.16,73 34.55,54.14 4,50 34.55,45.86 10.16,27 38.69,38.69 27,10.16 45.86,34.55"
      />
    </Svg>
  );
}

export function DiamondGrid({ size = 50, color = "#0A0A0A", opacity = 0.1 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Polygon points="50,4 96,50 50,96 4,50" fill="none" stroke={color} strokeWidth="2.5" />
      <Polygon points="50,20 80,50 50,80 20,50" fill="none" stroke={color} strokeWidth="2" />
      <Polygon points="50,36 64,50 50,64 36,50" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="50" cy="50" r="4" fill={color} />
    </Svg>
  );
}

export function Crosshair({ size = 44, color = "#0A0A0A", opacity = 0.1 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="2.5" />
      <Circle cx="50" cy="50" r="23" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="50" cy="50" r="7.5" fill={color} />
      <Line x1="3" y1="50" x2="23" y2="50" stroke={color} strokeWidth="2.5" />
      <Line x1="77" y1="50" x2="97" y2="50" stroke={color} strokeWidth="2.5" />
      <Line x1="50" y1="3" x2="50" y2="23" stroke={color} strokeWidth="2.5" />
      <Line x1="50" y1="77" x2="50" y2="97" stroke={color} strokeWidth="2.5" />
    </Svg>
  );
}

export function AsteriskStar({ size = 36, color = "#0A0A0A", opacity = 0.12 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Line x1="94" y1="50" x2="6" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="81.3" y1="81.3" x2="18.7" y2="18.7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="50" y1="94" x2="50" y2="6" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="18.7" y1="81.3" x2="81.3" y2="18.7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="73.3" y1="10" x2="26.7" y2="90" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="26.7" y1="10" x2="73.3" y2="90" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Circle cx="50" cy="50" r="8" fill={color} />
    </Svg>
  );
}

export function BlobSplat({ size = 90, color = "#0A0A0A", opacity = 0.05 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Path
        d="M50,12 L60.22,28.78 L79.71,26.31 L78.16,43.57 L87.05,58.46 L68.42,64.69 L66.49,84.23 L50,78.88 L33.51,84.23 L31.58,64.69 L12.95,58.46 L21.84,43.57 L20.29,26.31 L39.78,28.78 Z"
        fill={color}
      />
    </Svg>
  );
}

export function Halftone({ size = 56, color = "#0A0A0A", opacity = 0.06 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" opacity={opacity}>
      {Array.from({ length: 25 }).map((_, i) => (
        <Circle key={i} cx={(i % 5) * 12 + 4} cy={Math.floor(i / 5) * 12 + 4} r={2} fill={color} />
      ))}
    </Svg>
  );
}

export function WarpedTorus({ size = 100, color = "#0A0A0A", opacity = 0.07 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function RetroSquiggle({ size = 80, color = "#0A0A0A", opacity = 0.08 }: AccentProps) {
  return (
    <Svg width={size} height={(size * 24) / 140} viewBox="0 0 140 24" opacity={opacity}>
      <Path
        d="M0,12 Q14,2 28,12 Q42,22 56,12 Q70,2 84,12 Q98,22 112,12 Q126,2 140,12"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WireframeGlobe({ size = 64, color = "#0A0A0A", opacity = 0.08 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" opacity={opacity}>
      <Circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="2" />
      <Path d="M4 32 H60 M32 4 V60" stroke={color} strokeWidth="1.5" />
      <Path d="M20 8 Q32 32 20 56 M44 8 Q32 32 44 56" fill="none" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function FilledStarburst({ size = 72, color = "#0A0A0A" }: AccentProps) {
  const spikes = 16;
  const cx = 50;
  const cy = 50;
  const outer = 48;
  const inner = 18;
  const points = Array.from({ length: spikes * 2 }, (_, i) => {
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points={points} fill={color} />
    </Svg>
  );
}

export function FilledSplat({ size = 90, color = "#0A0A0A" }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M50 4 L58 28 L78 12 L68 36 L98 38 L72 52 L92 74 L64 64 L62 96 L50 72 L38 96 L36 64 L8 74 L28 52 L2 38 L32 36 L22 12 L42 28 Z"
        fill={color}
      />
    </Svg>
  );
}
