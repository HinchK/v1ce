import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import CoinFront from "@/components/CoinFront";

const WORDS = ["SOBER","UNBOTHERED","HYDRATED","EMPLOYABLE","ASCENDING","CRAZY","SLAYING","FEELING","EXPERIENCING","SHOWING UP","CAFFEINATED","UNHINGED","VALID","VIBING","GRATEFUL","GAY","PROUD","CLEAN","HAPPY","RICH","LOVED"];
const SUBSTANCES = ["Alcohol","Benzodiazepines","Caffeine","Cannabis","Cocaine","Gambling","Methamphetamine","Nicotine","OCD Compulsions","Opioids","Prescription Drugs","Social Media","Sugar","Other"];
const MILESTONES = [
  { days: 1, label: "1 DAY" }, { days: 7, label: "1 WEEK" }, { days: 30, label: "1 MONTH" },
  { days: 60, label: "2 MONTHS" }, { days: 90, label: "90 DAYS" }, { days: 180, label: "6 MONTHS" },
  { days: 365, label: "1 YEAR" }, { days: 730, label: "2 YEARS" }, { days: 1095, label: "3 YEARS" }, { days: 1825, label: "5 YEARS" },
];

function getElapsed(start?: string) {
  if (!start) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const date = new Date(start.includes("T") ? start : start + "T00:00:00");
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const ms = Math.max(0, Date.now() - timestamp);
  return { days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60, seconds: Math.floor(ms / 1000) % 60 };
}

function formatDate(value?: string) {
  if (!value) return "NOT SET";
  const date = new Date(value.includes("T") ? value : value + "T00:00:00");
  if (!Number.isFinite(date.getTime())) return "NOT SET";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

export default function Home() {
  const { profile } = useAuth();
  const c = useColors();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(() => getElapsed(profile?.sobriety_date), [profile?.sobriety_date, now]);
  const word = WORDS[Math.floor(now / 1500) % WORDS.length];

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.heroSmall, { color: c.foreground }]}>YOUR</Text>
        <Text style={[styles.heroWord, { color: c.foreground }]}>{word}</Text>
        <Pressable onPress={() => router.push("/(tabs)/customize")} style={styles.customizeLink}>
          <Text style={[styles.linkText, { color: c.foreground }]}>CUSTOMIZE →</Text>
        </Pressable>
      </View>

      <View style={[styles.coinSection, { borderBottomColor: c.foreground }]}>
        <CoinFront
          days={time.days}
          shape={profile?.coin_shape || "circle"}
          color={profile?.coin_color || "gold"}
          numberStyle={profile?.number_style || "classic"}
          size={292}
          displayName={profile?.display_name || ""}
          motto={profile?.coin_motto || ""}
          showBorder={profile?.coin_show_border ?? true}
          coinPhoto={profile?.coin_photo || undefined}
          imageOnlyMode={profile?.coin_image_only || false}
          borderColor={profile?.coin_border_color || undefined}
          numberColor={profile?.coin_number_color || undefined}
          onPress={() => {}}
        />
      </View>

      <View style={[styles.section, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>TIME{"\n"}ELAPSED</Text>
        <View style={styles.timeGrid}>
          <TimeCell value={time.days} label="DAYS" c={c} />
          <TimeCell value={time.hours} label="HRS" c={c} />
          <TimeCell value={time.minutes} label="MIN" c={c} />
          <TimeCell value={time.seconds} label="SEC" c={c} />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.eyebrow, { color: c.mutedForeground }]}>SOBER SINCE</Text>
        <Text style={[styles.date, { color: c.foreground }]}>{formatDate(profile?.sobriety_date)}</Text>
      </View>

      <View style={[styles.section, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>WHAT'S{"\n"}YOUR DOC?</Text>
        <Text style={[styles.subtext, { color: c.mutedForeground }]}>WHAT YOU'RE STAYING FREE FROM</Text>
        <View style={styles.chips}>
          {SUBSTANCES.map((item) => {
            const active = profile?.substances?.includes(item);
            return (
              <View key={item} style={[styles.chip, { backgroundColor: active ? c.foreground : c.background, borderColor: c.foreground }]}>
                <Text style={{ color: active ? c.background : c.foreground, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>{item.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: c.foreground }]}>
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>YOUR{"\n"}MILESTONES.</Text>
        <View style={styles.milestones}>
          {MILESTONES.map((item) => {
            const reached = time.days >= item.days;
            return (
              <View key={item.days} style={[styles.milestone, { borderColor: c.foreground, opacity: reached ? 1 : 0.42 }]}>
                <Text style={[styles.milestoneNumber, { color: c.foreground }]}>{item.days}</Text>
                <Text style={[styles.milestoneLabel, { color: c.foreground }]}>{item.label}</Text>
                <Text style={[styles.milestoneState, { color: c.foreground }]}>{reached ? "REACHED" : "UP NEXT"}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function TimeCell({ value, label, c }: { value: number; label: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.timeCell, { borderColor: c.foreground }]}>
      <Text style={[styles.timeValue, { color: c.foreground }]}>{String(value).padStart(2, "0")}</Text>
      <Text style={[styles.timeLabel, { color: c.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 80 },
  hero: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20, borderBottomWidth: 2 },
  heroSmall: { fontSize: 34, lineHeight: 34, fontWeight: "900", letterSpacing: -1 },
  heroWord: { fontSize: 58, lineHeight: 58, fontWeight: "900", letterSpacing: -2 },
  customizeLink: { marginTop: 16, alignSelf: "flex-start" },
  linkText: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  coinSection: { minHeight: 350, alignItems: "center", justifyContent: "center", paddingVertical: 28, borderBottomWidth: 2 },
  section: { paddingHorizontal: 20, paddingVertical: 28, borderBottomWidth: 2 },
  sectionTitle: { fontSize: 32, lineHeight: 29, fontWeight: "900", letterSpacing: -1 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 3, marginBottom: 8 },
  date: { fontSize: 28, lineHeight: 32, fontWeight: "800", letterSpacing: -0.5 },
  subtext: { marginTop: 10, fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  timeGrid: { flexDirection: "row", marginTop: 20 },
  timeCell: { flex: 1, minHeight: 94, borderWidth: 2, marginRight: -2, alignItems: "center", justifyContent: "center" },
  timeValue: { fontSize: 29, fontWeight: "900", lineHeight: 31 },
  timeLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 2, marginTop: 5 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 18 },
  chip: { borderWidth: 2, paddingHorizontal: 10, paddingVertical: 9 },
  milestones: { marginTop: 18, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  milestone: { width: "48%", minHeight: 104, borderWidth: 2, padding: 12 },
  milestoneNumber: { fontSize: 27, fontWeight: "900" },
  milestoneLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 3 },
  milestoneState: { fontSize: 8, fontWeight: "800", letterSpacing: 1.5, marginTop: 12 },
});
