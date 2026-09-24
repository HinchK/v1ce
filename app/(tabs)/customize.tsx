import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { usePremium } from "@/context/PremiumContext";
import { useRouter } from "expo-router";
import { supabase, TABLES } from "@/lib/supabase";
import ShapePicker from "@/components/customize/ShapePicker";
import ColorPicker from "@/components/customize/ColorPicker";
import NumberStylePicker from "@/components/customize/NumberStylePicker";
import BackgroundPicker from "@/components/customize/BackgroundPicker";
import MiniColorInput from "@/components/customize/MiniColorInput";
import DrawShapePicker from "@/components/customize/DrawShapePicker";
import { daysSince } from "@/constants/app";
import { fonts } from "@/constants/typography";
import { Crosshair } from "@/components/ui/RetroAccents";
import SobrietyCoin from "@/components/coin/SobrietyCoin";

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.toggleRow}>
      <TouchableOpacity onPress={onToggle} style={[styles.track, { backgroundColor: on ? colors.foreground : colors.secondary }]}>
        <View
          style={[
            styles.knob,
            { backgroundColor: colors.background, transform: [{ translateX: on ? 26 : 3 }] },
          ]}
        />
      </TouchableOpacity>
      <Text style={[styles.toggleLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function Customize() {
  const { profile, setProfile } = useAuth();
  const colors = useColors();
  const { isPremium } = usePremium();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [color, setColor] = useState(profile?.coin_color || "#E0E0E0");
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
  const [coinPhoto, setCoinPhoto] = useState(profile?.coin_photo || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setColor(profile.coin_color || "#E0E0E0");
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
    setCoinPhoto(profile.coin_photo || "");
  }, [profile]);

  const days = daysSince(profile?.sobriety_date);
  const pickCoinPhoto = async () => {
    if (!profile?.id || uploading) return;
    if (!isPremium) {
      router.push("/(tabs)/premium");
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("V1CE", "Photo access is required to choose a coin photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const body = await response.arrayBuffer();
      const extension = (asset.fileName?.split(".").pop() || asset.mimeType?.split("/").pop() || "jpg").toLowerCase();
      const path = `${profile.id}/${Date.now()}.${extension}`;
      const { error } = await supabase.storage
        .from("coin-photos")
        .upload(path, body, { contentType: asset.mimeType || "image/jpeg", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("coin-photos").getPublicUrl(path);
      setCoinPhoto(data.publicUrl);
    } catch (error: any) {
      Alert.alert("V1CE", error?.message || "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  };

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
      coin_photo: coinPhoto,
    };
    const { data, error } = await supabase.from(TABLES.SobrietyProfile).update(values).eq("id", profile.id).select().single();
    if (!error) setProfile(data || { ...profile, ...values });
    setSaving(false);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={[styles.preview, { borderBottomColor: colors.foreground }]}>
        <SobrietyCoin
          days={days}
          shape={shape}
          color={color}
          numberStyle={style}
          size={200}
          displayName={displayName}
          motto={motto}
          customShapePath={customShapePath}
          showBorder={border}
          borderColor={borderColor || undefined}
          numberColor={numberColor || undefined}
          imageOnlyMode={imageOnlyMode}
          coinPhoto={coinPhoto}
          background={background}
          substances={profile?.substances}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <ShapePicker value={shape} onChange={setShape} />
        {shape === "drawn" ? (
          <View style={{ marginTop: 16 }}>
            <DrawShapePicker value={customShapePath} onChange={setCustomShapePath} />
          </View>
        ) : null}
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>COIN PHOTO</Text>
          {!isPremium ? (
            <View style={[styles.badge, { borderColor: colors.foreground }]}>
              <Text style={[styles.badgeText, { color: colors.foreground }]}>PREMIUM</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Upload a photo to appear on your coin face</Text>
        {coinPhoto ? <Image source={{ uri: coinPhoto }} style={styles.photoPreview} /> : null}
        <TouchableOpacity onPress={pickCoinPhoto} disabled={uploading} style={[styles.dashed, { borderColor: colors.foreground }]}>
          <Text style={[styles.dashedText, { color: colors.foreground }]}>
            {uploading ? "UPLOADING..." : coinPhoto ? "CHANGE PHOTO" : "+ UPLOAD PHOTO"}
          </Text>
        </TouchableOpacity>
        {coinPhoto ? (
          <TouchableOpacity onPress={() => { setCoinPhoto(""); setImageOnlyMode(false); }}>
            <Text style={[styles.removePhoto, { color: colors.mutedForeground }]}>REMOVE</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>IMAGE MODE</Text>
          {!isPremium ? (
            <View style={[styles.badge, { borderColor: colors.foreground }]}>
              <Text style={[styles.badgeText, { color: colors.foreground }]}>PREMIUM</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Show only your photo on the front. Your sober time, name & motto move to the back.
        </Text>
        <Switch
          on={imageOnlyMode && isPremium}
          onToggle={() => (isPremium ? setImageOnlyMode(!imageOnlyMode) : router.push("/(tabs)/premium"))}
          label={imageOnlyMode && isPremium ? "On — photo fills front" : "Off"}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>PERSONALIZE</Text>
        <Text style={[styles.micro, { color: colors.mutedForeground }]}>DISPLAY NAME</Text>
        <TextInput
          value={displayName}
          onChangeText={(v) => setDisplayName(v.slice(0, 20))}
          maxLength={20}
          placeholder="Your name"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground, borderColor: colors.foreground }]}
        />
        <Text style={[styles.micro, { color: colors.mutedForeground, marginTop: 16 }]}>PERSONAL MOTTO</Text>
        <TextInput
          value={motto}
          onChangeText={(v) => setMotto(v.slice(0, 30))}
          maxLength={30}
          placeholder="Your personal motto"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground, borderColor: colors.foreground }]}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>COLOR</Text>
        <ColorPicker value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#E0E0E0"} onChange={setColor} />

        <View style={[styles.inner, { borderTopColor: colors.foreground }]}>
          <Text style={[styles.subhead, { color: colors.foreground }]}>BACKGROUND</Text>
          <BackgroundPicker value={background} onChange={setBackground} />
        </View>

        <View style={[styles.inner, { borderTopColor: colors.foreground }]}>
          <Text style={[styles.subhead, { color: colors.foreground }]}>BORDER</Text>
          <Switch on={border} onToggle={() => setBorder(!border)} label={border ? "Show" : "Hide"} />
          {border ? (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.micro, { color: colors.mutedForeground }]}>
                BORDER COLOR <Text style={{ opacity: 0.5 }}>(LEAVE BLANK FOR AUTO)</Text>
              </Text>
              <MiniColorInput value={borderColor} onChange={setBorderColor} placeholder="AUTO" />
            </View>
          ) : null}
        </View>

        <View style={[styles.inner, { borderTopColor: colors.foreground }]}>
          <Text style={[styles.subhead, { color: colors.foreground }]}>NUMBER COLOR</Text>
          <Text style={[styles.micro, { color: colors.mutedForeground }]}>LEAVE BLANK TO AUTO-CONTRAST WITH COIN COLOR</Text>
          <MiniColorInput value={numberColor} onChange={setNumberColor} placeholder="AUTO" />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.crosshair}>
          <Crosshair size={44} color={colors.foreground} opacity={0.18} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>NUMBER STYLE</Text>
        <NumberStylePicker value={style} onChange={setStyle} />
      </View>

      <TouchableOpacity onPress={save} disabled={saving} style={[styles.save, { backgroundColor: colors.foreground, opacity: saving ? 0.45 : 1 }]}>
        <Text style={{ color: colors.background, fontSize: 22, fontFamily: fonts.display, letterSpacing: 2 }}>
          {saving ? "SAVING..." : "SAVE CHANGES →"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 48 },
  preview: { alignItems: "center", paddingVertical: 20, borderBottomWidth: 2 },
  section: { paddingHorizontal: 20, paddingVertical: 26, borderBottomWidth: 2 },
  sectionTitle: { fontSize: 26, fontFamily: fonts.display, letterSpacing: 1, marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  badge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 8, fontFamily: fonts.bodyBold, letterSpacing: 1.2 },
  sub: { fontSize: 13, lineHeight: 18, fontFamily: fonts.body, marginBottom: 14 },
  dashed: { height: 52, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  dashedText: { fontSize: 18, fontFamily: fonts.display, letterSpacing: 2 },
  photoPreview: { width: 112, height: 112, alignSelf: "center", marginBottom: 14 },
  removePhoto: { textAlign: "center", fontSize: 10, fontFamily: fonts.bodyBold, letterSpacing: 2, marginTop: 10 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  track: { width: 56, height: 32, borderRadius: 16, justifyContent: "center" },
  knob: { width: 26, height: 26, borderRadius: 13 },
  toggleLabel: { fontSize: 15, fontFamily: fonts.body },
  micro: { fontSize: 9, letterSpacing: 1.6, fontFamily: fonts.bodyBold, marginBottom: 8 },
  input: { borderWidth: 2, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, fontFamily: fonts.body, backgroundColor: "#FFFFFF" },
  inner: { marginTop: 22, paddingTop: 22, borderTopWidth: 2 },
  subhead: { fontSize: 20, fontFamily: fonts.display, letterSpacing: 1, marginBottom: 12 },
  crosshair: { position: "absolute", right: 12, top: 18 },
  save: { marginHorizontal: 20, marginTop: 26, height: 56, alignItems: "center", justifyContent: "center" },
});
