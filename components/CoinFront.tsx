import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, ClipPath, G, Image as SvgImage, Path, Polygon } from "react-native-svg";
import { COIN_COLORS, NUMBER_STYLES, SHAPE_POLYGONS, resolveCoinColor } from "@/constants/coin";

export { COIN_COLORS, NUMBER_STYLES };
export const SHAPES = ["circle", "hexagon", "octagon", "shield", "diamond", "star", "cross", "badge", "arrow"] as const;

type Props = {
  days?: number;
  shape?: string;
  color?: string;
  numberStyle?: string;
  size?: number;
  displayName?: string;
  motto?: string;
  showBorder?: boolean;
  coinPhoto?: string;
  imageOnlyMode?: boolean;
  borderColor?: string;
  numberColor?: string;
  customShapePath?: string;
};

const PATHS: Record<string, string> = {
  hexagon: "M25 0 L75 0 L100 50 L75 100 L25 100 L0 50 Z",
  octagon: "M30 0 L70 0 L100 30 L100 70 L70 100 L30 100 L0 70 L0 30 Z",
  shield: "M50 0 L100 15 L100 65 L50 100 L0 65 L0 15 Z",
  diamond: "M50 0 L95 50 L50 100 L5 50 Z",
  star: "M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z",
  cross: "M33 0 L67 0 L67 33 L100 33 L100 67 L67 67 L67 100 L33 100 L33 67 L0 67 L0 33 L33 33 Z",
  badge: "M50 0 L65 10 L82 5 L90 20 L100 30 L95 50 L100 70 L90 80 L82 95 L65 90 L50 100 L35 90 L18 95 L10 80 L0 70 L5 50 L0 30 L10 20 L18 5 L35 10 Z",
  arrow: "M0 35 L55 35 L55 10 L100 50 L55 90 L55 65 L0 65 Z",
};


const NATIVE_FONT_FAMILIES: Record<string, string> = {
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
};

function shapePath(shape: string) {
  return PATHS[shape] || PATHS.hexagon;
}

function parseCustomPolygon(value?: string) {
  if (!value) return null;
  const points = value
    .split(/\s+/)
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => pair.replace(/%/g, "").split(","))
    .filter((p) => p.length === 2)
    .map(([x, y]) => `${parseFloat(x)},${parseFloat(y)}`)
    .filter((p) => !p.includes("NaN"))
    .join(" ");
  return points || null;
}

export default function CoinFront({
  days = 0,
  shape = "circle",
  color = "gold",
  numberStyle = "classic",
  size = 260,
  displayName,
  motto,
  showBorder = true,
  coinPhoto,
  imageOnlyMode = false,
  borderColor,
  numberColor,
  customShapePath,
}: Props) {
  const colors = resolveCoinColor(color);
  const style = NUMBER_STYLES[numberStyle as keyof typeof NUMBER_STYLES] || NUMBER_STYLES.classic;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const mainNumber = years >= 1 ? years : months >= 1 ? months : days;
  const label = years >= 1 ? (years === 1 ? "YEAR" : "YEARS") : months >= 1 ? (months === 1 ? "MONTH" : "MONTHS") : "DAYS";
  const customPoints = shape === "drawn" ? parseCustomPolygon(customShapePath) : null;
  const isSvgShape = shape !== "circle";
  const clipId = `coin-${Math.round(size)}-${shape.replace(/[^a-z0-9]/gi, "")}`;
  const textColor = numberColor || colors.text;
  const strokeColor = borderColor || colors.border;
  const fontSize = size * (["star", "cross", "arrow"].includes(shape) ? 0.25 : 0.32);
  const maxWidth = size * (["star", "cross", "arrow"].includes(shape) ? 0.6 : 0.8);
  const verticalOffset = ["arrow", "badge"].includes(shape) ? size * 0.05 : 0;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {isSvgShape && !customPoints && (
            <ClipPath id={clipId}><Path d={shapePath(shape)} /></ClipPath>
          )}
          {customPoints && <ClipPath id={clipId}><Polygon points={customPoints} /></ClipPath>}
        </Defs>
        {shape === "circle" ? (
          <>
            <Circle cx="50" cy="50" r="48" fill={colors.bg} />
            {coinPhoto && <SvgImage href={{ uri: coinPhoto }} x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid slice" opacity={imageOnlyMode ? 1 : 0.35} />}
            {showBorder && <Circle cx="50" cy="50" r="48" fill="none" stroke={strokeColor} strokeWidth="3" />}
          </>
        ) : (
          <>
            <G clipPath={`url(#${clipId})`}>
              <Path d={customPoints ? "" : shapePath(shape)} fill={colors.bg} />
              {customPoints && <Polygon points={customPoints} fill={colors.bg} />}
              {coinPhoto && <SvgImage href={{ uri: coinPhoto }} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" opacity={imageOnlyMode ? 1 : 0.35} />}
            </G>
            {showBorder && !customPoints && <Path d={shapePath(shape)} fill="none" stroke={strokeColor} strokeWidth="3" />}
            {showBorder && customPoints && <Polygon points={customPoints} fill="none" stroke={strokeColor} strokeWidth="3" />}
          </>
        )}
      </Svg>

      {!imageOnlyMode && (
        <View pointerEvents="none" style={[styles.content, { width: maxWidth, top: size * 0.5 - fontSize * 0.52 + verticalOffset }]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.number,
              {
                color: textColor,
                fontSize,
                letterSpacing: fontSize * (style.letterSpacing ?? 0),
                fontWeight: style.fontWeight,
                fontFamily: NATIVE_FONT_FAMILIES[style.fontFamily] || undefined,
              },
            ]}
          >
            {mainNumber}
          </Text>
          <Text style={[styles.label, { color: textColor, fontSize: size * 0.09 }]}> {label}</Text>
          {displayName && <Text numberOfLines={1} style={[styles.name, { color: textColor, fontSize: size * 0.04 }]}>{displayName.toUpperCase()}</Text>}
          {motto && <Text numberOfLines={2} style={[styles.motto, { color: textColor, fontSize: size * 0.035 }]}>{motto}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  content: { position: "absolute", alignItems: "center", justifyContent: "center", alignSelf: "center" },
  number: { fontWeight: "700", lineHeight: undefined, includeFontPadding: false, textAlign: "center" },
  label: { fontWeight: "700", letterSpacing: 3, opacity: 0.7, textAlign: "center" },
  name: { fontWeight: "500", letterSpacing: 2, opacity: 0.45, marginTop: 8, textAlign: "center" },
  motto: { letterSpacing: 0.5, opacity: 0.65, marginTop: 4, textAlign: "center" },
});
