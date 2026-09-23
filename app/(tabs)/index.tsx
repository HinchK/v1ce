import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useCoinContext } from "@/context/CoinContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/lib/i18n";
import { supabase, TABLES } from "@/lib/supabase";
import { daysSince } from "@/constants/app";
import { fonts } from "@/constants/typography";
import SobrietyCoin from "@/components/coin/SobrietyCoin";
import RotatingLabel from "@/components/home/RotatingLabel";
import SobrietyCounter from "@/components/home/SobrietyCounter";
import SubstanceChecklist from "@/components/home/SubstanceChecklist";
import MilestoneTimeline from "@/components/home/MilestoneTimeline";
import MilestoneCalendarExport from "@/components/home/MilestoneCalendarExport";
import { FilledSplat, FilledStarburst, WireframeGlobe } from "@/components/ui/RetroAccents";

export default function Home() {
  const { profile, setProfile } = useAuth();
  const { updateCoinData } = useCoinContext();
  const colors = useColors();
  const { t } = useTranslation();
  const router = useRouter();
  const [substances, setSubstances] = useState<string[]>(profile?.substances || []);
  const sobrietyDate = profile?.sobriety_date || "";
  const days = daysSince(sobrietyDate);

  useEffect(() => {
    setSubstances(profile?.substances || []);
  }, [profile?.substances]);

  useEffect(() => {
    updateCoinData({ days, color: profile?.coin_color || "#E0E0E0", displayName: profile?.display_name || "" });
  }, [days, profile?.coin_color, profile?.display_name, updateCoinData]);

  const persist = async (values: Record<string, unknown>) => {
    if (!profile?.id) return;
    const { data } = await supabase.from(TABLES.SobrietyProfile).update(values).eq("id", profile.id).select().single();
    if (data) setProfile(data);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { borderBottomColor: colors.foreground }]}>
        <View style={styles.burst}>
          <FilledStarburst size={72} color={colors.foreground} />
        </View>
        <Text style={[styles.days, { color: colors.foreground }]}>{days}</Text>
        <RotatingLabel />
        <View style={styles.coinWrap}>
          <SobrietyCoin
            days={days}
            shape={profile?.coin_shape || "circle"}
            color={profile?.coin_color || "#E0E0E0"}
            numberStyle={profile?.number_style || "classic"}
            size={250}
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
        <Pressable onPress={() => router.push("/(tabs)/customize")} style={styles.customizeWrap}>
          <Text style={[styles.link, { color: colors.mutedForeground, borderBottomColor: colors.mutedForeground }]}>
            {t("home.customize")}
          </Text>
        </Pressable>
        <View style={styles.splat}>
          <FilledSplat size={88} color={colors.foreground} />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("home.timeElapsed")}</Text>
        <SobrietyCounter sobrietyDate={sobrietyDate} />
      </View>

      <View style={[styles.section, { borderBottomColor: colors.foreground }]}>
        <View style={styles.globe}>
          <WireframeGlobe size={56} color={colors.foreground} opacity={1} />
        </View>
        <View style={styles.docBurst}>
          <FilledStarburst size={48} color={colors.foreground} />
        </View>
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
          <View style={styles.docBurst}>
            <FilledStarburst size={52} color={colors.foreground} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("home.yourMilestones")}</Text>
          <MilestoneTimeline days={days} />
          <MilestoneCalendarExport sobrietyDate={sobrietyDate} displayName={profile?.display_name} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 48 },
  hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, borderBottomWidth: 2, overflow: "hidden" },
  days: {
    fontSize: 132,
    lineHeight: 118,
    letterSpacing: -4,
    fontFamily: fonts.display,
    marginLeft: -6,
  },
  burst: { position: "absolute", right: 12, top: 18 },
  splat: { position: "absolute", left: -6, bottom: -10 },
  coinWrap: { alignItems: "center", paddingVertical: 18 },
  customizeWrap: { alignItems: "center", zIndex: 2 },
  link: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 2.4,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  section: { paddingHorizontal: 20, paddingVertical: 28, borderBottomWidth: 2, position: "relative" },
  sectionTitle: { fontSize: 48, lineHeight: 46, fontFamily: fonts.display, letterSpacing: 0.5, marginBottom: 18 },
  globe: { position: "absolute", right: 16, bottom: 20, opacity: 0.9 },
  docBurst: { position: "absolute", right: 10, top: 18 },
});
