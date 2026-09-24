export const COIN_COLORS = {
  gold: { bg: "#F5D680", border: "#0A0A0A", text: "#0A0A0A", accent: "#C4922E" },
  silver: { bg: "#E0E0E0", border: "#0A0A0A", text: "#0A0A0A", accent: "#909090" },
  bronze: { bg: "#CD7F32", border: "#0A0A0A", text: "#0A0A0A", accent: "#8B4513" },
  rose_gold: { bg: "#E8B4B8", border: "#0A0A0A", text: "#0A0A0A", accent: "#A45A68" },
  midnight: { bg: "#0A0A0A", border: "#FFFFFF", text: "#FFFFFF", accent: "#555555" },
  emerald: { bg: "#2E8B57", border: "#0A0A0A", text: "#0A0A0A", accent: "#155E30" },
} as const;

export const NUMBER_STYLES = {
  classic: { fontFamily: "Cinzel", fontWeight: "700" as const, letterSpacing: 0.02 },
  poppins: { fontFamily: "Poppins", fontWeight: "700" as const, letterSpacing: -0.01 },
  monospace: { fontFamily: "Space Mono", fontWeight: "700" as const, letterSpacing: -0.03 },
  fredoka: { fontFamily: "Fredoka One", fontWeight: "400" as const, letterSpacing: 0.02 },
  serif: { fontFamily: "IBM Plex Serif", fontWeight: "700" as const, letterSpacing: 0.01 },
  dmsans: { fontFamily: "DM Sans", fontWeight: "700" as const, letterSpacing: -0.02 },
  courier: { fontFamily: "Courier Prime", fontWeight: "700" as const, letterSpacing: 0.05 },
  bodoni: { fontFamily: "Bodoni Moda", fontWeight: "700" as const, letterSpacing: 0.03 },
  syne: { fontFamily: "Syne", fontWeight: "700" as const, letterSpacing: -0.02 },
  pacifico: { fontFamily: "Pacifico", fontWeight: "400" as const, letterSpacing: 0.01 },
  bebas: { fontFamily: "Bebas Neue", fontWeight: "400" as const, letterSpacing: 0.08 },
  inter: { fontFamily: "Inter", fontWeight: "700" as const, letterSpacing: -0.02 },
  big_shoulders_stencil: { fontFamily: "Big Shoulders Stencil", fontWeight: "400" as const, letterSpacing: 0.02 },
  sedgwick_ave_display: { fontFamily: "Sedgwick Ave Display", fontWeight: "400" as const, letterSpacing: 0.01 },

  roboto_mono: { fontFamily: "Roboto Mono", fontWeight: "700" as const, letterSpacing: -0.03 },
  arimo: { fontFamily: "Arimo", fontWeight: "700" as const, letterSpacing: -0.01 },
  oswald: { fontFamily: "Oswald", fontWeight: "600" as const, letterSpacing: 0.02 },
  raleway: { fontFamily: "Raleway", fontWeight: "700" as const, letterSpacing: 0.01 },
  saira: { fontFamily: "Saira", fontWeight: "700" as const, letterSpacing: -0.01 },
  edu_qld_hand: { fontFamily: "Edu QLD Hand", fontWeight: "500" as const, letterSpacing: 0.01 },
  josefin_sans: { fontFamily: "Josefin Sans", fontWeight: "600" as const, letterSpacing: 0.01 },
  fraunces: { fontFamily: "Fraunces", fontWeight: "700" as const, letterSpacing: 0.01 },
  caveat: { fontFamily: "Caveat", fontWeight: "400" as const, letterSpacing: 0.01 },
  geist_pixel: { fontFamily: "Geist Pixel", fontWeight: "400" as const, letterSpacing: 0 },
  dyna_puff: { fontFamily: "DynaPuff", fontWeight: "600" as const, letterSpacing: 0.01 },
} as const;

export const SHAPE_POLYGONS: Record<string, string> = {
  hexagon: "25,0 75,0 100,50 75,100 25,100 0,50",
  octagon: "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30",
  shield: "50,0 100,15 100,65 50,100 0,65 0,15",
  diamond: "50,0 95,50 50,100 5,50",
  star: "50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35",
  badge: "50,0 65,10 82,5 90,20 100,30 95,50 100,70 90,80 82,95 65,90 50,100 35,90 18,95 10,80 0,70 5,50 0,30 10,20 18,5 35,10",
  arrow: "0,35 55,35 55,10 100,50 55,90 55,65 0,65",
};

export function resolveCoinColor(color: string) {
  if (color in COIN_COLORS) return COIN_COLORS[color as keyof typeof COIN_COLORS];
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const text = luminance > 0.6 ? "#000000" : luminance > 0.5 ? "#0A0A0A" : "#FFFFFF";
    return { bg: color, border: text, text, accent: text };
  }
  return COIN_COLORS.gold;
}
