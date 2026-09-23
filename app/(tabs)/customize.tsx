import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { supabase, TABLES } from "@/lib/supabase";
import SobrietyCoin from "@/components/coin/SobrietyCoin";
import ShapePicker from "@/components/customize/ShapePicker";
import ColorPicker from "@/components/customize/ColorPicker";
import NumberStylePicker from "@/components/customize/NumberStylePicker";
import BackgroundPicker from "@/components/customize/BackgroundPicker";
import DrawShapePicker from "@/components/customize/DrawShapePicker";
import { COIN_COLORS, resolveCoinColor } from "@/constants/coin";
import { daysSince } from "@/constants/app";
import { AsteriskStar, Crosshair, DiamondGrid, Starburst } from "@/components/ui/RetroAccents";

const ROTATING_WORDS = ["COIN", "TOKEN", "CHIP", "V1CE", "JOURNEY", "PROGRESS", "BAGEL", "SHINY CIRCLE", "NOT A NICKEL", "PIZZA FUND", "PET ROCK", "DOUBLOON", "PAPERWEIGHT", "SOUVENIR", "OBJECT", "THINGY"];

export default function Customize() {
  const { profile, setProfile } = useAuth();
  const colors = useColors();
  const [wordIndex, setWordIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [color, setColor] = useState(profile?.coin_color || "#F5D680");
  const [shape, setShape] = useState(profile?.coin_shape || "circle");
  const [style, setStyle] = useState(profile?.number_style || "classic");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [motto, setMotto] = useState(profile?.coin_motto || "");
  const [customShapePath, setCustomShapePath] = useState(profile?.coin_shape_path || "");
  const [imageOnlyMode, setImageOnlyMode] = useState(profile?.coin_image_only || false);
  const [border, setBorder] = useState(profile?.coin_show_border ?? true);
  const [borderColor, setBorderColor] = useState(profile?.coin_border_color || "");
  const [numberColor, setNumberColor] = useState(profile?.coin_number_color || "");
  const [background, setBackground] = useState(profile?.coin_background || "solid");
  const [customHex, setCustomHex] = useState(/^#[0-9A-Fa-f]{6}$/.test(profile?.coin_color || "") ? profile?.coin_color || "" : "");

  useEffect(() => {
    const id = setInterval(() => setWordIndex((v) => (v + 1) % ROTATING_WORDS.length), 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setColor(profile.coin_color || "#F5D680");
    setShape(profile.coin_shape || "circle");
    setStyle(profile.number_style || "classic");
    setDisplayName(profile.display_name || "");
    setMotto((profile.coin_motto || "").slice(0, 30));
    setCustomShapePath(profile.coin_shape_path || "");
    setImageOnlyMode(profile.coin_image_only || false);
    setBorder(profile.coin_show_border ?? true);
    setBorderColor(profile.coin_border_color || "");
    setNumberColor(profile.coin_number_color || "");
    setBackground(profile.coin_background || "solid");
  }, [profile]);

  const days = daysSince(profile?.sobriety_date);
  const save = async () => {
    if (!profile?.id || saving) return;
    setSaving(true);
    const values = {
      coin_shape: shape,
      coin_color: color,
      number_style: style,
      display_name: displayName,
      coin_motto: motto.slice(0, 30),
      coin_shape_path: customShapePath,
      coin_show_border: border,
      coin_border_color: borderColor || null,
      coin_number_color: numberColor || null,
      coin_image_only: imageOnlyMode,
      coin_background: background,
    };
    const { data, error } = await supabase.from(TABLES.SobrietyProfile).update(values).eq("id", profile.id).select().single();
    if (!error) setProfile(data || { ...profile, ...values });
    setSaving(false);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={[styles.hero, { borderBottomColor: colors.foreground }]}>
        <View style={styles.accent}><Starburst size={90} color={colors.foreground} opacity={0.08} /></View>
        <View style={[styles.accent, { right: 42, top: 40 }]}><DiamondGrid size={50} color={colors.foreground} /></View>
        <Text style={[styles.heroText, { color: colors.foreground }]}>YOUR</Text>
        <Text style={[styles.heroWord, { color: colors.foreground }]}>{ROTATING_WORDS[wordIndex]}</Text>
      </View>
      <View style={[styles.preview, { borderBottomColor: colors.foreground }]}>
        <SobrietyCoin
          days={days}
          shape={shape}
          color={color}
          numberStyle={style}
          size={240}
          displayName={displayName}
          motto={motto}
          customShapePath={customShapePath}
          showBorder={border}
          borderColor={borderColor || undefined}
          numberColor={numberColor || undefined}
          imageOnlyMode={imageOnlyMode}
          background={background}
          substances={profile?.substances}
        />
      </View>

      <Section title="SHAPE" colors={colors}>
        <View style={styles.accent}><AsteriskStar size={36} color={colors.foreground} /></View>
        <ShapePicker value={shape} onChange={setShape} />
        {shape === "drawn" ? <View style={{ marginTop: 16 }}><DrawShapePicker value={customShapePath} onChange={setCustomShapePath} /></View> : null}
      </Section>

      <Section title="BACKGROUND" colors={colors}>
        <BackgroundPicker value={background} onChange={setBackground} />
      </Section>

      <Section title="COLOR" colors={colors}>
        <View style={styles.named}>
          {Object.keys(COIN_COLORS).map((name) => {
            const coin = COIN_COLORS[name as keyof typeof COIN_COLORS];
            return (
              <TouchableOpacity key={name} onPress={() => { setColor(name); setCustomHex(""); }} style={[styles.colorChip, { backgroundColor: coin.bg, borderColor: color === name ? colors.foreground : colors.border }]}>
                <Text style={{ color: coin.text, fontSize: 10, fontWeight: "900" }}>{name.replace("_", " ").toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <ColorPicker value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : resolveCoinColor(color).bg} onChange={(hex) => { setColor(hex); setCustomHex(hex); }} />
        <TextInput
          value={customHex}
          onChangeText={(v) => {
            const next = v.startsWith("#") ? v : `#${v}`;
            setCustomHex(next.slice(0, 7));
            if (/^#[0-9A-Fa-f]{6}$/.test(next)) setColor(next.toUpperCase());
          }}
          maxLength={7}
          autoCapitalize="characters"
          placeholder="#F5D680"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground, borderColor: colors.foreground, marginTop: 12 }]}
        />
      </Section>

      <Section title="BORDER" colors={colors}>
        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setBorder(!border)} style={[styles.toggle, { backgroundColor: border ? colors.foreground : colors.secondary }]}>
            <View style={[styles.knob, { backgroundColor: colors.background, transform: [{ translateX: border ? 24 : 2 }] }]} />
          </TouchableOpacity>
          <Text style={{ color: colors.mutedForeground }}>{border ? "SHOW" : "HIDE"}</Text>
        </View>
        {border ? (
          <TextInput value={borderColor} onChangeText={setBorderColor} placeholder="Auto border hex" maxLength={7} placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.foreground, marginTop: 12 }]} />
        ) : null}
      </Section>

      <Section title="NUMBER COLOR" colors={colors}>
        <TextInput value={numberColor} onChangeText={setNumberColor} placeholder="Auto number hex" maxLength={7} placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.foreground }]} />
      </Section>

      <Section title="NUMBER STYLE" colors={colors}>
        <View style={styles.accent}><Crosshair size={44} color={colors.foreground} /></View>
        <NumberStylePicker value={style} onChange={setStyle} />
      </Section>

      <Section title="PERSONALIZE" colors={colors}>
        <Text style={[styles.micro, { color: colors.mutedForeground }]}>DISPLAY NAME</Text>
        <TextInput value={displayName} onChangeText={(v) => setDisplayName(v.slice(0, 20))} maxLength={20} placeholder="Your name" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.foreground }]} />
        <Text style={[styles.micro, { color: colors.mutedForeground, marginTop: 16 }]}>PERSONAL MOTTO</Text>
        <TextInput value={motto} onChangeText={(v) => setMotto(v.slice(0, 30))} maxLength={30} placeholder="Your personal motto" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.foreground }]} />
      </Section>

      <TouchableOpacity onPress={save} disabled={saving} style={[styles.save, { backgroundColor: colors.foreground, opacity: saving ? 0.45 : 1 }]}>
        <Text style={{ color: colors.background, fontSize: 22, fontWeight: "900", letterSpacing: 2 }}>{saving ? "SAVING..." : "SAVE CHANGES →"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, colors, children }: { title: string; colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      <View style={{ marginTop: 18 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 100 },
  hero: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 22, borderBottomWidth: 2, overflow: "hidden" },
  heroText: { fontSize: 42, lineHeight: 40, fontWeight: "900" },
  heroWord: { fontSize: 54, lineHeight: 52, fontWeight: "900" },
  accent: { position: "absolute", right: 8, top: 8 },
  preview: { minHeight: 330, alignItems: "center", justifyContent: "center", paddingVertical: 28, borderBottomWidth: 2 },
  section: { paddingHorizontal: 20, paddingVertical: 28, borderBottomWidth: 2, position: "relative" },
  sectionTitle: { fontSize: 28, lineHeight: 30, fontWeight: "900" },
  named: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  colorChip: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 11 },
  input: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggle: { width: 54, height: 30, borderRadius: 18, justifyContent: "center" },
  knob: { width: 26, height: 26, borderRadius: 13 },
  micro: { fontSize: 9, letterSpacing: 2.5, fontWeight: "800", marginBottom: 8 },
  save: { marginHorizontal: 20, marginTop: 26, height: 56, alignItems: "center", justifyContent: "center" },
});
