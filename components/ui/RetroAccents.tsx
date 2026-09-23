import React from "react";
import Svg, { Circle, Path, Polygon } from "react-native-svg";

type AccentProps = { size?: number; color?: string; opacity?: number };

export function Starburst({ size = 64, color = "#0A0A0A", opacity = 0.08 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return <Path key={i} d={`M50 50 L${50 + Math.cos(a) * 48} ${50 + Math.sin(a) * 48}`} stroke={color} strokeWidth="2" />;
      })}
    </Svg>
  );
}

export function DiamondGrid({ size = 50, color = "#0A0A0A", opacity = 0.1 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 50 50" opacity={opacity}>
      <Path d="M25 2 L48 25 L25 48 L2 25 Z" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function Crosshair({ size = 44, color = "#0A0A0A", opacity = 0.1 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" opacity={opacity}>
      <Path d="M22 0 V44 M0 22 H44" stroke={color} strokeWidth="2" />
      <Circle cx="22" cy="22" r="8" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function AsteriskStar({ size = 36, color = "#0A0A0A", opacity = 0.12 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" opacity={opacity}>
      <Path d="M18 2 V34 M4 18 H32 M7 7 L29 29 M29 7 L7 29" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function BlobSplat({ size = 90, color = "#0A0A0A", opacity = 0.05 }: AccentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 90 90" opacity={opacity}>
      <Path d="M20 40 Q10 10 40 18 Q70 8 72 40 Q88 70 50 78 Q12 72 20 40 Z" fill={color} />
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
    <Svg width={size} height={size} viewBox="0 0 80 80" opacity={opacity}>
      <Path d="M4 40 Q20 8 40 40 T76 40" fill="none" stroke={color} strokeWidth="3" />
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
