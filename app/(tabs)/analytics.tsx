import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { MILESTONES, daysSince } from "@/constants/app";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Analytics() {
  const colors = useColors();
  const { profile } = useAuth();
  const days = daysSince(profile?.sobriety_date);
  const reached = MILESTONES.filter((item) => days >= item.days).length;
  const week = Math.min(7, days);
  const bars = useMemo(() => {
    const today = new Date().getDay();
    return DAYS.map((_, i) => {
      const offset = (i + 1) % 7;
      return days > 0 && offset <= today ? Math.min(1, 0.35 + ((days + i) % 7) / 10) : 0.15;
    });
  }, [days]);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>YOUR{"\n"}STATS.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Weekly check-ins and streak progress.</Text>

      <View style={[styles.chart, { borderColor: colors.foreground }]}>
        <Text style={[styles.chartTitle, { color: colors.foreground }]}>THIS WEEK</Text>
        <View style={styles.bars}>
          {bars.map((h, i) => (
            <View key={DAYS[i]} style={styles.barCol}>
              <View style={[styles.bar, { height: 24 + h * 90, backgroundColor: colors.foreground }]} />
              <Text style={[styles.day, { color: colors.mutedForeground }]}>{DAYS[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.cards}>
        {[
          ["LONGEST STREAK", `${days} DAYS`],
          ["TOTAL CHECK-INS", `${days}`],
          ["THIS WEEK", `${week}`],
          ["MILESTONES", `${reached}/${MILESTONES.length}`],
        ].map(([label, value]) => (
          <View key={label} style={[styles.card, { borderColor: colors.foreground }]}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>{label}</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 54, fontWeight: "900", lineHeight: 52, letterSpacing: -1 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 18 },
  chart: { borderWidth: 2, marginTop: 36, padding: 18, minHeight: 190 },
  chartTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  bars: { height: 140, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 18 },
  barCol: { alignItems: "center", flex: 1 },
  bar: { width: 22 },
  day: { fontSize: 9, fontWeight: "800", marginTop: 8, letterSpacing: 1 },
  cards: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  card: { width: "48%", borderWidth: 2, minHeight: 92, padding: 14 },
  cardLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  cardValue: { fontSize: 22, fontWeight: "900", marginTop: 8 },
});
