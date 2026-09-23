import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useCoinContext } from "@/context/CoinContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/lib/i18n";
import { supabase, TABLES } from "@/lib/supabase";
import { daysSince } from "@/constants/app";
import SobrietyCoin from "@/components/coin/SobrietyCoin";
import RotatingLabel from "@/components/home/RotatingLabel";
import SobrietyCounter from "@/components/home/SobrietyCounter";
import SubstanceChecklist from "@/components/home/SubstanceChecklist";
import MilestoneTimeline from "@/components/home/MilestoneTimeline";
import MilestoneCalendarExport from "@/components/home/MilestoneCalendarExport";
import { AsteriskStar, BlobSplat, Crosshair, DiamondGrid, Halftone, Starburst, WarpedTorus } from "@/components/ui/RetroAccents";

export default function Home() {
  const { profile, setProfile } = useAuth();
  const { updateCoinData } = useCoinContext();
  const colors = useColors();
  const { t } = useTranslation();
  const router = useRouter();
  const [substances, setSubstances] = useState<string[]>(profile?.substances || []);
  const [sobrietyDate, setSobrietyDate] = useState(profile?.sobriety_date || "");
  const days = daysSince(sobrietyDate);

  useEffect(() => {
    setSubstances(profile?.substances || []);
    setSobrietyDate(profile?.sobriety_date || "");
  }, [profile?.substances, profile?.sobriety_date]);

  useEffect(() => {
    updateCoinData({ days, color: profile?.coin_color || "#F5D680", displayName: profile?.display_name || "" });
  }, [days, profile?.coin_color, profile?.display_name, updateCoinData]);

  const persist = async (values: Record<string, unknown>) => {
    if (!profile?.id) return;
    const { data } = await supabase.from(TABLES.SobrietyProfile).update(values).eq("id", profile.id).select().single();
    if (data) setProfile(data);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { borderBottomColor: colors.foreground, overflow: "hidden" }]}>
        <View style={styles.accentTopRight}><Starburst size={64} color={colors.foreground} /></View>
        <View style={styles.accentBottomLeft}><BlobSplat size={90} color={colors.foreground} /></View>
        <Text style={[styles.days, { color: colors.foreground }]}>{days}</Text>
        <RotatingLabel mode="labels" style={[styles.rotate, { color: colors.foreground }]} />
        <View style={styles.coinWrap}>
          <SobrietyCoin
            days={days}
            shape={profile?.coin_shape || "circle"}
            color={profile?.coin_color || "#F5D680"}
            numberStyle={profile?.number_style || "classic"}
            size={260}
            displayName={profile?.display_name || ""}
            motto={profile?.coin_motto}
            customShapePath={profile?.coin_shape_path || undefined}
            showBorder={profile?.coin_show_border ?? true}
            coinPhoto={profile?.coin_photo || undefined}
            borderColor={profile?.coin_border_color || undefined}
            numberColor={profile?.coin_number_color || undefined}
            imageOnlyMode={profile?.coin_image_only || false}
            background={profile?.coin_background}
            substances={substances}
          />
        </View>
        <Pressable onPress={() => router.push("/(tabs)/customize")}>
          <Text style={[styles.link, { color: colors.mutedForeground }]}>{t("home.customize")}</Text>
        </Pressable>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.accentTopRight}><DiamondGrid size={72} color={colors.foreground} /></View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("home.timeElapsed")}</Text>
        <SobrietyCounter sobrietyDate={sobrietyDate} />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{t("home.soberSince")}</Text>
        <TextInput
          value={sobrietyDate}
          onChangeText={(value) => {
            setSobrietyDate(value);
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) persist({ sobriety_date: value });
          }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.dateInput, { color: colors.foreground, borderColor: colors.foreground }]}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.accentTopRight}><Crosshair size={60} color={colors.foreground} /></View>
        <View style={styles.accentBottomRight}><Halftone size={56} color={colors.foreground} /></View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("home.whatsYourDoc")}</Text>
        <SubstanceChecklist
          selected={substances}
          onChange={(next) => {
            setSubstances(next);
            persist({ substances: next });
          }}
        />
      </View>

      {days > 0 ? (
        <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
          <View style={styles.accentTopRight}><AsteriskStar size={48} color={colors.foreground} /></View>
          <View style={styles.accentBottomRight}><WarpedTorus size={100} color={colors.foreground} /></View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("home.yourMilestones")}</Text>
          <MilestoneTimeline days={days} />
          <MilestoneCalendarExport sobrietyDate={sobrietyDate} displayName={profile?.display_name} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 100 },
  section: { paddingHorizontal: 20, paddingVertical: 28, borderBottomWidth: 2, position: "relative" },
  days: { fontSize: 96, fontWeight: "900", lineHeight: 96, letterSpacing: -2, fontFamily: "Inter_700Bold" },
  rotate: { fontSize: 28, fontWeight: "800", letterSpacing: 2, marginTop: 8, fontFamily: "Inter_700Bold" },
  coinWrap: { alignItems: "center", paddingVertical: 20 },
  link: { fontSize: 12, fontWeight: "800", letterSpacing: 2, textAlign: "center" },
  sectionTitle: { fontSize: 32, lineHeight: 34, fontWeight: "900", letterSpacing: -1, marginBottom: 18 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 3, marginBottom: 8 },
  dateInput: { borderWidth: 2, padding: 12, fontSize: 18, fontFamily: "Inter_600SemiBold" },
  accentTopRight: { position: "absolute", right: 8, top: 8 },
  accentBottomLeft: { position: "absolute", left: -6, bottom: -4 },
  accentBottomRight: { position: "absolute", right: 0, bottom: 8 },
});
