import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Image as SvgImage, Path, Polygon } from "react-native-svg";
import { COIN_COLORS, NUMBER_STYLES, resolveCoinColor } from "@/constants/coin";

export { COIN_COLORS, NUMBER_STYLES };

export const SHAPES = ["circle","hexagon","octagon","shield","diamond","star","badge","arrow","drawn"] as const;
type Shape = typeof SHAPES[number];

const PATHS: Record<string,string> = {
  hexagon:"M25 2 L75 2 L100 50 L75 98 L25 98 L0 50 Z",
  octagon:"M30 2 L70 2 L98 30 L98 70 L70 98 L30 98 L2 70 L2 30 Z",
  shield:"M50 2 L100 17 L100 65 L50 100 L0 65 L0 17 Z",
  diamond:"M50 2 L95 50 L50 100 L5 50 Z",
  star:"M50 2 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z",
  badge:"M50 0 L65 10 L82 5 L90 20 L100 30 L95 50 L100 70 L90 80 L82 95 L65 90 L50 100 L35 90 L18 95 L10 80 L0 70 L5 50 L0 30 L10 20 L18 5 L35 10 Z",
  arrow:"M0 35 L55 35 L55 10 L100 50 L55 90 L55 65 L0 65 Z",
};

const FONT_FAMILIES: Record<string,string> = {
  "Big Shoulders Stencil":"BigShouldersStencilDisplayRegular",
  "Roboto Mono":"RobotoMonoWidget",
  "Oswald":"OswaldWidget",
  "Raleway":"RalewayWidget",
  "Fraunces":"FrauncesWidget",
  "Caveat":"CaveatWidget",
  "DynaPuff":"DynaPuffWidget",
};

type CoinFrontProps = {
  days: number;
  shape?: string;
  color?: string;
  numberStyle?: string;
  size?: number;
  displayName?: string;
  motto?: string;
  customShapePath?: string;
  showBorder?: boolean;
  coinPhoto?: string;
  imageOnlyMode?: boolean;
  borderColor?: string;
  numberColor?: string;
};

export default function CoinFront({
  days,
  shape = "circle",
  color = "gold",
  numberStyle = "classic",
  size = 240,
  displayName = "",
  motto = "",
  customShapePath = "",
  showBorder = true,
  coinPhoto,
  imageOnlyMode = false,
  borderColor,
  numberColor,
}: CoinFrontProps) {
  const coin = resolveCoinColor(color);
  const textColor = numberColor || coin.text;
  const outline = borderColor || coin.border;
  const safeShape = (SHAPES as readonly string[]).includes(shape) ? shape as Shape : "circle";
  const style = NUMBER_STYLES[numberStyle as keyof typeof NUMBER_STYLES];
  const fontFamily = style?.fontFamily ? FONT_FAMILIES[style.fontFamily] : undefined;
  const fontWeight = style?.fontWeight === "700" || style?.fontWeight === "600" ? "800" : "500";
  const photo = coinPhoto && /^https?:\/\//.test(coinPhoto) ? coinPhoto : undefined;
  const borderWidth = showBorder ? 3 : 0;
  const number = Math.max(0, Math.floor(days)).toLocaleString();

  const renderShape = () => {
    if (safeShape === "circle") return <Circle cx="50" cy="50" r="47" fill={coin.bg} stroke={outline} strokeWidth={borderWidth / 2} />;
    if (safeShape === "drawn" && customShapePath) return <Path d={customShapePath} fill={coin.bg} stroke={outline} strokeWidth={borderWidth / 2} />;
    if (safeShape === "drawn") return <Circle cx="50" cy="50" r="47" fill={coin.bg} stroke={outline} strokeWidth={borderWidth / 2} />;
    return <Path d={PATHS[safeShape]} fill={coin.bg} stroke={outline} strokeWidth={borderWidth / 2} />;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {renderShape()}
        {photo && imageOnlyMode ? (
          <SvgImage href={{ uri: photo }} x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid slice" clipPath="url(#coinClip)" />
        ) : null}
        {!imageOnlyMode ? (
          <>
            <Polygon points="18,15 82,15 86,19 14,19" fill={coin.accent} opacity={0.45} />
            <View />
          </>
        ) : null}
      </Svg>
      {!imageOnlyMode ? (
        <View pointerEvents="none" style={styles.content}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.number, { color: textColor, fontFamily, fontWeight: fontWeight as any }]}>
            {number}
          </Text>
          {displayName ? <Text numberOfLines={1} style={[styles.name, { color: textColor }]}>{displayName}</Text> : null}
          {motto ? <Text numberOfLines={2} style={[styles.motto, { color: textColor }]}>{motto}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  content: { position: "absolute", left: 12, right: 12, top: "28%", alignItems: "center", justifyContent: "center" },
  number: { fontSize: 58, lineHeight: 64, letterSpacing: -1, textAlign: "center" },
  name: { marginTop: 4, fontSize: 12, lineHeight: 15, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center" },
  motto: { marginTop: 5, fontSize: 10, lineHeight: 13, fontWeight: "600", textAlign: "center" },
});
