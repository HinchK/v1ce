export const COIN_COLORS = {
  gold: { bg: "#F5D680", border: "#0A0A0A", text: "#0A0A0A", accent: "#C4922E" },
  silver: { bg: "#E0E0E0", border: "#0A0A0A", text: "#0A0A0A", accent: "#909090" },
  bronze: { bg: "#CD7F32", border: "#0A0A0A", text: "#0A0A0A", accent: "#8B4513" },
  rose_gold: { bg: "#E8B4B8", border: "#0A0A0A", text: "#0A0A0A", accent: "#A45A68" },
  midnight: { bg: "#0A0A0A", border: "#FFFFFF", text: "#FFFFFF", accent: "#555555" },
  emerald: { bg: "#2E8B57", border: "#0A0A0A", text: "#0A0A0A", accent: "#155E30" },
} as const;

export const NUMBER_STYLES = {
  roboto_mono: { fontFamily: "Roboto Mono", fontWeight: "700" as const, letterSpacing: -0.03 },
  oswald: { fontFamily: "Oswald", fontWeight: "600" as const, letterSpacing: 0.02 },
  raleway: { fontFamily: "Raleway", fontWeight: "700" as const, letterSpacing: 0.01 },
  fraunces: { fontFamily: "Fraunces", fontWeight: "700" as const, letterSpacing: 0.01 },
  caveat: { fontFamily: "Caveat", fontWeight: "400" as const, letterSpacing: 0.01 },
  dyna_puff: { fontFamily: "DynaPuff", fontWeight: "600" as const, letterSpacing: 0.01 },
} as const;
