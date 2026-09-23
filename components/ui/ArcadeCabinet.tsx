import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { fonts } from "@/constants/typography";

export default function ArcadeCabinet() {
  return (
    <View style={styles.wrap}>
      <View style={styles.glowLeft} />
      <View style={styles.glowRight} />
      <View style={styles.cabinet}>
        <View style={styles.bezel}>
          <View style={styles.screen}>
            <Text style={styles.logo}>V1CE</Text>
            <Text style={styles.logo}>RUN</Text>
            <Text style={styles.level}>LEVEL 1</Text>
            <View style={styles.hud}>
              <Text style={styles.hudText}>SCORE:{"\n"}0</Text>
              <Text style={[styles.hudText, { textAlign: "right" }]}>HI-SCORE{"\n"}0</Text>
            </View>
            <Svg width="100%" height={120} viewBox="0 0 220 120">
              <Path d="M8 96 H212" stroke="#39FF14" strokeWidth="3" />
              <Path d="M8 100 H212" stroke="#1DBA0A" strokeWidth="2" />
              <Rect x="18" y="78" width="10" height="18" fill="#39FF14" />
              <Path d="M22 78 L22 68 L18 72 L26 72 Z" fill="#39FF14" />
              <Circle cx="44" cy="92" r="4" fill="#C0C0C0" />
              <Circle cx="52" cy="88" r="3" fill="#E8E8E8" />
              <Rect x="70" y="82" width="18" height="6" rx="2" fill="#D0D0D0" />
              <Rect x="76" y="70" width="4" height="14" fill="#B0B0B0" />
              <Circle cx="78" cy="68" r="4" fill="#E74C3C" />
              <Path d="M130 92 L138 70 L146 92 Z" fill="#2E7D32" />
              <Rect x="136" y="58" width="8" height="14" fill="#1B5E20" />
              <Circle cx="140" cy="54" r="6" fill="#C8E6C9" />
              <Path
                d="M168 92 L172 70 L180 70 L184 56 L192 60 L186 74 L196 92 Z"
                fill="#39FF14"
              />
              <Circle cx="182" cy="50" r="8" fill="#39FF14" />
              <Rect x="176" y="46" width="4" height="3" fill="#0A0A0A" />
              <Rect x="186" y="46" width="4" height="3" fill="#0A0A0A" />
              <Path d="M196 74 H210" stroke="#39FF14" strokeWidth="2" strokeDasharray="4 3" />
            </Svg>
          </View>
        </View>
        <View style={styles.plate}>
          <Text style={styles.plateText}>V1CE RUN</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, alignItems: "center" },
  glowLeft: {
    position: "absolute",
    left: 8,
    top: 10,
    bottom: 10,
    width: 10,
    backgroundColor: "#7B2BFF",
    opacity: 0.85,
  },
  glowRight: {
    position: "absolute",
    right: 8,
    top: 10,
    bottom: 10,
    width: 10,
    backgroundColor: "#7B2BFF",
    opacity: 0.85,
  },
  cabinet: {
    width: "92%",
    backgroundColor: "#0A0A0A",
    borderWidth: 2,
    borderColor: "#1A1A1A",
    overflow: "hidden",
  },
  bezel: { padding: 10, paddingBottom: 0 },
  screen: {
    backgroundColor: "#030303",
    minHeight: 210,
    paddingHorizontal: 14,
    paddingTop: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
  logo: {
    color: "#39FF14",
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 32,
    letterSpacing: 1,
  },
  level: {
    color: "#39FF14",
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.9,
  },
  hud: { position: "absolute", right: 12, top: 12 },
  hudText: { color: "#39FF14", fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 0.5, lineHeight: 12 },
  plate: {
    backgroundColor: "#0A0A0A",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: "#111",
  },
  plateText: {
    color: "#F5F5F5",
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 2,
  },
});
