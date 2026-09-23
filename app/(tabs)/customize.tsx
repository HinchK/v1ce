import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import CoinFront, { NUMBER_STYLES, SHAPES } from "@/components/CoinFront";
import { COIN_COLORS, resolveCoinColor } from "@/constants/coin";

const ROTATING_WORDS = ["COIN","TOKEN","CHIP","V1CE","JOURNEY","PROGRESS","BAGEL","SHINY CIRCLE","NOT A NICKEL","PIZZA FUND","PET ROCK","DOUBLOON","PAPERWEIGHT","SOUVENIR","OBJECT","THINGY"];
const PRESET_COLORS = ["gold","silver","bronze","rose_gold","midnight","emerald"];

export default function Customize() {
  const { profile, setProfile } = useAuth();
  const c = useColors();
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [color, setColor] = useState(profile?.coin_color || "gold");
  const [shape, setShape] = useState(profile?.coin_shape || "circle");
  const [style, setStyle] = useState(profile?.number_style || "classic");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [motto, setMotto] = useState(profile?.coin_motto || "");
  const [imageOnlyMode, setImageOnlyMode] = useState(profile?.coin_image_only || false);
  const [border, setBorder] = useState(profile?.coin_show_border ?? true);
  const [borderColor, setBorderColor] = useState(profile?.coin_border_color || "");
  const [numberColor, setNumberColor] = useState(profile?.coin_number_color || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((value) => (value + 1) % ROTATING_WORDS.length), 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setColor(profile.coin_color || "gold");
    setShape(profile.coin_shape || "circle");
    setStyle(profile.number_style || "classic");
    setDisplayName(profile.display_name || "");
    setMotto(profile.coin_motto || "");
    setImageOnlyMode(profile.coin_image_only || false);
    setBorder(profile.coin_show_border ?? true);
    setBorderColor(profile.coin_border_color || "");
    setNumberColor(profile.coin_number_color || "");
  }, [profile]);

  const days = profile?.sobriety_date
    ? Math.max(0, Math.floor((Date.now() - new Date(profile.sobriety_date + "T00:00:00").getTime()) / 86400000))
    : 0;

  const activeColors = resolveCoinColor(color);

  const save = async () => {
    if (!profile?.email || saving) return;
    setSaving(true);
    const values = {
      coin_color: color,
      coin_shape: shape,
      number_style: style,
      display_name: displayName,
      coin_motto: motto,
      coin_image_only: imageOnlyMode,
      coin_show_border: border,
      coin_border_color: borderColor || null,
      coin_number_color: numberColor || null,
    };
    const { data, error } = await supabase.from("profiles").update(values).eq("email", profile.email).select().single();
    if (!error) setProfile(data || { ...profile, ...values });
    setSaving(false);
  };

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={[styles.hero, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.heroYour, { color: c.foreground }]}>YOUR</Text>
        <Text style={[styles.heroWord, { color: c.foreground }]}>{ROTATING_WORDS[wordIndex]}</Text>
      </View>

      <View style={[styles.preview, { borderBottomColor: c.foreground }]}>
        <CoinFront
          days={days}
          color={color}
          shape={shape}
          numberStyle={style}
          size={240}
          displayName={displayName}
          motto={motto}
          imageOnlyMode={imageOnlyMode}
          showBorder={border}
          borderColor={borderColor || undefined}
          numberColor={numberColor || undefined}
          onPress={() => {}}
        />
      </View>

      <Section title="SHAPE" c={c}>
        <View style={styles.wrap}>
          {SHAPES.map((item) => (
            <TouchableOpacity key={item} onPress={() => setShape(item)} style={[styles.option, { borderColor: shape === item ? c.foreground : c.border }]}>
              <Text style={{ color: c.foreground, fontSize: 11, fontWeight: "800", letterSpacing: 1 }}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      <Section title="COIN PHOTO" c={c}>
        <Text style={[styles.body, { color: c.mutedForeground }]}>UPLOAD A PHOTO TO APPEAR ON YOUR COIN FACE.</Text>
        <View style={[styles.disabled, { borderColor: c.border }]}>
          <Text style={{ color: c.mutedForeground, fontWeight: "800", letterSpacing: 1 }}>+ UPLOAD PHOTO — COMING SOON</Text>
        </View>
      </Section>

      <Section title="PERSONALIZE" c={c}>
        <Field label="DISPLAY NAME" value={displayName} onChangeText={(value) => setDisplayName(value.slice(0, 20))} placeholder="Your name or nickname" c={c} />
        <Field label="PERSONAL MOTTO" value={motto} onChangeText={(value) => setMotto(value.slice(0, 50))} placeholder="Your personal motto (back of coin)" c={c} />
      </Section>

      <Section title="COLOR" c={c}>
        <View style={styles.wrap}>
          {PRESET_COLORS.map((name) => {
            const coin = COIN_COLORS[name as keyof typeof COIN_COLORS];
            return (
              <TouchableOpacity key={name} onPress={() => setColor(name)} style={[styles.colorChip, { backgroundColor: coin.bg, borderColor: color === name ? c.foreground : c.border }]}>
                <Text style={{ color: coin.text, fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>{name.replace("_", " ").toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Section>

      <Section title="BORDER" c={c}>
        <TouchableOpacity onPress={() => setBorder(!border)} style={[styles.toggle, { borderColor: c.foreground }]}>
          <Text style={{ color: c.foreground, fontWeight: "800", letterSpacing: 1 }}>BORDER: {border ? "ON" : "OFF"}</Text>
        </TouchableOpacity>
        <Text style={[styles.micro, { color: c.mutedForeground }]}>BORDER COLOR</Text>
        <View style={styles.colorRow}>
          {["", "#0A0A0A", "#FFFFFF", "#F5A41A"].map((value) => (
            <TouchableOpacity key={value || "auto"} onPress={() => setBorderColor(value)} style={[styles.dot, { backgroundColor: value || activeColors.border, borderColor: c.foreground, opacity: borderColor === value ? 1 : 0.45 }]} />
          ))}
        </View>
      </Section>

      <Section title="NUMBER STYLE" c={c}>
        <View style={styles.wrap}>
          {Object.keys(NUMBER_STYLES).map((item) => (
            <TouchableOpacity key={item} onPress={() => setStyle(item)} style={[styles.option, { borderColor: style === item ? c.foreground : c.border }]}>
              <Text style={{ color: c.foreground, fontSize: 10, fontWeight: "800", letterSpacing: 1 }}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.micro, { color: c.mutedForeground }]}>NUMBER COLOR</Text>
        <View style={styles.colorRow}>
          {["", "#0A0A0A", "#FFFFFF", "#F5A41A"].map((value) => (
            <TouchableOpacity key={value || "auto"} onPress={() => setNumberColor(value)} style={[styles.dot, { backgroundColor: value || activeColors.text, borderColor: c.foreground, opacity: numberColor === value ? 1 : 0.45 }]} />
          ))}
        </View>
      </Section>

      <Section title="IMAGE MODE" c={c}>
        <Text style={[styles.body, { color: c.mutedForeground }]}>SHOW ONLY YOUR PHOTO ON THE FRONT. SOBER TIME, NAME & MOTTO MOVE TO THE BACK.</Text>
        <TouchableOpacity onPress={() => profile?.is_premium ? setImageOnlyMode(!imageOnlyMode) : router.push("/(tabs)/premium")} style={[styles.toggle, { borderColor: c.foreground }]}>
          <Text style={{ color: c.foreground, fontWeight: "800", letterSpacing: 1 }}>IMAGE ONLY: {imageOnlyMode && profile?.is_premium ? "ON" : "OFF"}{!profile?.is_premium ? " • PREMIUM" : ""}</Text>
        </TouchableOpacity>
      </Section>

      <TouchableOpacity onPress={save} disabled={saving} style={[styles.save, { backgroundColor: c.foreground, opacity: saving ? 0.5 : 1 }]}>
        <Text style={{ color: c.background, fontSize: 16, fontWeight: "900", letterSpacing: 2 }}>{saving ? "SAVING..." : "SAVE CHANGES →"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, c, children }: { title: string; c: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <View style={[styles.section, { borderBottomColor: c.foreground }]}>
      <Text style={[styles.sectionTitle, { color: c.foreground }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, c }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={[styles.micro, { color: c.mutedForeground }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.foreground }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 80 },
  hero: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 22, borderBottomWidth: 2 },
  heroYour: { fontSize: 42, lineHeight: 40, fontWeight: "900", letterSpacing: -1 },
  heroWord: { fontSize: 54, lineHeight: 52, fontWeight: "900", letterSpacing: -2 },
  preview: { minHeight: 330, alignItems: "center", justifyContent: "center", paddingVertical: 28, borderBottomWidth: 2 },
  section: { paddingHorizontal: 20, paddingVertical: 28, borderBottomWidth: 2 },
  sectionTitle: { fontSize: 28, lineHeight: 30, fontWeight: "900", letterSpacing: -0.5 },
  sectionBody: { marginTop: 18 },
  body: { fontSize: 11, lineHeight: 17, letterSpacing: 1.2, fontWeight: "600" },
  micro: { fontSize: 9, letterSpacing: 2.5, fontWeight: "800", marginBottom: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderWidth: 2, paddingHorizontal: 11, paddingVertical: 10 },
  colorChip: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 11 },
  input: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  disabled: { borderWidth: 2, borderStyle: "dashed", minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 14 },
  toggle: { minHeight: 48, borderWidth: 2, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  colorRow: { flexDirection: "row", gap: 10 },
  dot: { width: 38, height: 38, borderWidth: 2 },
  save: { marginHorizontal: 20, marginTop: 26, height: 56, alignItems: "center", justifyContent: "center" },
});
