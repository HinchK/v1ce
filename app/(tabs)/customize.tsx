import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { usePremium } from "@/context/PremiumContext";
import { useTranslation } from "@/lib/i18n";
import { daysSince } from "@/constants/app";
import { fonts } from "@/constants/typography";
import SobrietyCoin from "@/components/coin/SobrietyCoin";
import ShapePicker from "@/components/customize/ShapePicker";
import ColorPicker from "@/components/customize/ColorPicker";
import NumberStylePicker from "@/components/customize/NumberStylePicker";
import { AsteriskStar, Crosshair, DiamondGrid, Starburst } from "@/components/ui/RetroAccents";
import { supabase, TABLES } from "@/lib/supabase";

const ROTATING_WORDS = [
  "COIN", "TOKEN", "CHIP", "V1CE", "JOURNEY", "PROGRESS", "BAGEL",
  "SHINY CIRCLE", "NOT A NICKEL", "PIZZA FUND", "PET ROCK", "DOUBLOON",
  "PAPERWEIGHT", "SOUVENIR", "OBJECT", "THINGY",
];

function Switch({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.switchRow}>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.switchTrack, { backgroundColor: on ? colors.foreground : colors.secondary }]}
      >
        <View
          style={[
            styles.switchKnob,
            {
              backgroundColor: colors.background,
              transform: [{ translateX: on ? 28 : 4 }],
            },
          ]}
        />
      </TouchableOpacity>
      <Text style={[styles.switchLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function MiniColorInput({
  value,
  onChange,
  placeholder = "Auto",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const colors = useColors();
  const valid = /^#[0-9A-Fa-f]{6}$/.test(value);
  return (
    <View style={styles.colorInputRow}>
      <View
        style={[
          styles.colorDot,
          {
            borderColor: colors.foreground,
            backgroundColor: valid ? value : "transparent",
          },
        ]}
      />
      <TextInput
        value={value}
        onChangeText={(v) => {
          const next = v.toUpperCase();
          if (/^#[0-9A-F]{6}$/.test(next) || next === "" || next.length <= 7) onChange(next);
        }}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        maxLength={7}
        autoCapitalize="characters"
        style={[styles.colorInput, { color: "#000000", borderColor: colors.foreground }]}
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChange("")}>
          <Text style={[styles.autoText, { color: colors.mutedForeground }]}>AUTO</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function Customize() {
  const { profile, setProfile } = useAuth();
  const colors = useColors();
  const { isPremium } = usePremium();
  const { t } = useTranslation();
  const router = useRouter();

  const [wordIndex, setWordIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [shape, setShape] = useState("circle");
  const [color, setColor] = useState("#F5D680");
  const [numberStyle, setNumberStyle] = useState("classic");
  const [displayName, setDisplayName] = useState("");
  const [motto, setMotto] = useState("");
  const [customShapePath, setCustomShapePath] = useState("");
  const [showBorder, setShowBorder] = useState(true);
  const [borderColor, setBorderColor] = useState("");
  const [numberColor, setNumberColor] = useState("");
  const [imageOnlyMode, setImageOnlyMode] = useState(false);
  const [coinPhoto, setCoinPhoto] = useState("");

  useEffect(() => {
    const interval = setInterval(
      () => setWordIndex((previous) => (previous + 1) % ROTATING_WORDS.length),
      1500,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setShape(profile.coin_shape || "circle");
    setColor(profile.coin_color || "#F5D680");
    setNumberStyle(profile.number_style || "classic");
    setDisplayName(profile.display_name || "");
    setMotto(profile.coin_motto || "");
    setCustomShapePath(profile.coin_shape_path || "");
    setShowBorder(profile.coin_show_border !== false);
    setBorderColor(profile.coin_border_color || "");
    setNumberColor(profile.coin_number_color || "");
    setImageOnlyMode(profile.coin_image_only || false);
    setCoinPhoto(profile.coin_photo || "");
  }, [profile]);

  const handleSave = async () => {
    if (!profile?.id || saving) return;
    setSaving(true);

    const values = {
      coin_shape: shape,
      coin_color: color,
      number_style: numberStyle,
      display_name: displayName,
      coin_motto: motto,
      coin_shape_path: customShapePath,
      coin_show_border: showBorder,
      coin_border_color: borderColor || null,
      coin_number_color: numberColor || null,
      coin_image_only: imageOnlyMode,
      coin_photo: coinPhoto,
    };

    const { data, error } = await supabase
      .from(TABLES.SobrietyProfile)
      .update(values)
      .eq("id", profile.id)
      .select()
      .single();

    if (!error) {
      setProfile(data || { ...profile, ...values });
    }

    setSaving(false);
  };

  if (!profile) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.foreground} />
      </View>
    );
  }

  const daysSober = daysSince(profile.sobriety_date);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { borderBottomColor: colors.foreground }]}>
        <Starburst
          size={90}
          color={colors.foreground}
          opacity={0.08}
        />
        <DiamondGrid
          size={50}
          color={colors.foreground}
          opacity={0.1}
        />
        <Text style={[styles.headerText, { color: colors.foreground }]}>
          {t("customize.your") || "YOUR"}
          {"\n"}
          <Text style={styles.outlineWord}>{ROTATING_WORDS[wordIndex]}</Text>
        </Text>
        <View style={styles.headerStar}>
          <Starburst size={90} color={colors.foreground} opacity={0.08} />
        </View>
        <View style={styles.headerGrid}>
          <DiamondGrid size={50} color={colors.foreground} opacity={0.1} />
        </View>
      </View>

      <View style={[styles.preview, { borderBottomColor: colors.foreground }]}>
        <SobrietyCoin
          days={daysSober}
          shape={shape}
          color={color}
          numberStyle={numberStyle}
          size={240}
          substances={profile.substances || []}
          displayName={displayName}
          motto={motto}
          customShapePath={customShapePath}
          showBorder={showBorder}
          coinPhoto={coinPhoto}
          borderColor={borderColor}
          numberColor={numberColor}
          imageOnlyMode={imageOnlyMode}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.decorTopRight}>
          <AsteriskStar size={36} color={colors.foreground} opacity={0.12} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {t("customize.shape")}
        </Text>
        <ShapePicker value={shape} onChange={setShape} />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground, opacity: 0.6 }]}>
        <View style={styles.inlineTitle}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 0 }]}>
            {t("customize.coinPhoto")}
          </Text>
          <View style={[styles.badge, { borderColor: colors.foreground }]}>
            <Text style={[styles.badgeText, { color: colors.foreground }]}>COMING SOON</Text>
          </View>
        </View>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          {t("customize.coinPhotoSub")}
        </Text>
        <View style={[styles.comingSoonButton, { borderColor: colors.foreground }]}>
          <Text style={[styles.comingSoonText, { color: colors.foreground }]}>
            + {t("customize.coinPhotoUpload")}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.inlineTitle}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 0 }]}>
            IMAGE MODE
          </Text>
          {!isPremium && (
            <View style={[styles.badge, { borderColor: colors.foreground, opacity: 0.6 }]}>
              <Text style={[styles.badgeText, { color: colors.foreground }]}>PREMIUM</Text>
            </View>
          )}
        </View>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Show only your photo on the front. Your sober time, name & motto move to the back.
        </Text>
        <Switch
          on={imageOnlyMode && isPremium}
          onToggle={() =>
            isPremium
              ? setImageOnlyMode((previous) => !previous)
              : router.push("/(tabs)/premium")
          }
          label={imageOnlyMode && isPremium ? "On — photo fills front" : "Off"}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {t("customize.personalize")}
        </Text>

        <Text style={[styles.micro, { color: colors.mutedForeground }]}>
          {t("customize.displayName").toUpperCase()}
        </Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={t("customize.displayNamePlaceholder")}
          placeholderTextColor="#999999"
          maxLength={20}
          style={[styles.input, { color: "#000000", borderColor: colors.foreground }]}
        />

        <Text style={[styles.micro, { color: colors.mutedForeground, marginTop: 20 }]}>
          {t("customize.motto").toUpperCase()}
        </Text>
        <TextInput
          value={motto}
          onChangeText={setMotto}
          placeholder={t("customize.mottoPlaceholder")}
          placeholderTextColor="#999999"
          maxLength={50}
          style={[styles.input, { color: "#000000", borderColor: colors.foreground }]}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {t("customize.color")}
        </Text>
        <ColorPicker value={color} onChange={setColor} />

        <View style={[styles.inner, { borderTopColor: colors.border }]}>
          <Text style={[styles.subhead, { color: colors.foreground }]}>
            {t("customize.border")}
          </Text>
          <Switch
            on={showBorder}
            onToggle={() => setShowBorder((previous) => !previous)}
            label={showBorder ? t("customize.show") : t("customize.hide")}
          />

          {showBorder && (
            <View style={{ marginTop: 18 }}>
              <Text style={[styles.micro, { color: colors.mutedForeground }]}>
                BORDER COLOR{" "}
                <Text style={{ opacity: 0.5 }}>(LEAVE BLANK FOR AUTO)</Text>
              </Text>
              <MiniColorInput value={borderColor} onChange={setBorderColor} />
            </View>
          )}
        </View>

        <View style={[styles.inner, { borderTopColor: colors.border }]}>
          <Text style={[styles.subhead, { color: colors.foreground }]}>NUMBER COLOR</Text>
          <Text style={[styles.micro, { color: colors.mutedForeground }]}>
            LEAVE BLANK TO AUTO-CONTRAST WITH COIN COLOR
          </Text>
          <MiniColorInput value={numberColor} onChange={setNumberColor} />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.decorTopRight}>
          <Crosshair size={44} color={colors.foreground} opacity={0.1} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {t("customize.numberStyle")}
        </Text>
        <NumberStylePicker value={numberStyle} onChange={setNumberStyle} />
      </View>

      <View style={styles.saveWrap}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[
            styles.save,
            {
              backgroundColor: colors.foreground,
              opacity: saving ? 0.4 : 1,
            },
          ]}
        >
          <Text style={[styles.saveText, { color: colors.background }]}>
            {saving ? t("customize.saving") : t("customize.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 64 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    minHeight: 180,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 2,
    position: "relative",
    overflow: "hidden",
  },
  headerText: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 48,
    letterSpacing: 1,
    zIndex: 2,
  },
  outlineWord: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 52,
    fontWeight: "900",
    color: "transparent",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  headerStar: { position: "absolute", right: 2, top: -2 },
  headerGrid: { position: "absolute", right: 64, bottom: 8 },

  preview: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 2,
  },

  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomWidth: 2,
    position: "relative",
    overflow: "hidden",
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: 1,
    marginBottom: 16,
  },
  inlineTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  badge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 8, letterSpacing: 1.4 },
  sub: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginBottom: 16 },
  comingSoonButton: {
    height: 48,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonText: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: 2,
  },

  micro: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
  },

  inner: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
  },
  subhead: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: 1,
    marginBottom: 12,
  },

  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchTrack: {
    width: 64,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  switchKnob: { width: 32, height: 32, borderRadius: 16 },
  switchLabel: { fontFamily: fonts.body, fontSize: 14 },

  colorInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  colorInput: {
    flex: 1,
    height: 36,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  autoText: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2 },

  decorTopRight: { position: "absolute", top: 16, right: 16 },
  saveWrap: { paddingHorizontal: 20, paddingTop: 24 },
  save: { height: 56, alignItems: "center", justifyContent: "center" },
  saveText: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 2 },
});
