import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MILESTONES } from "@/constants/app";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function MilestoneTimeline({ days }: { days: number }) {
  const colors = useColors();
  const progress = Math.min(100, (days / 1825) * 100);
  return (
    <View>
      <View style={[styles.track, { borderColor: colors.foreground }]}>
        <View style={[styles.fill, { backgroundColor: colors.foreground, width: `${progress}%` }]} />
      </View>
      <View style={styles.grid}>
        {MILESTONES.map((item) => {
          const reached = days >= item.days;
          return (
            <View key={item.days} style={[styles.card, { borderColor: colors.foreground, opacity: reached ? 1 : 0.42 }]}>
              <Text style={[styles.number, { color: colors.foreground }]}>{item.days}</Text>
              <Text style={[styles.label, { color: colors.foreground }]}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderWidth: 2, marginBottom: 16 },
  fill: { height: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: { width: "31.5%", minHeight: 92, borderWidth: 2, padding: 10 },
  number: { fontSize: 23, fontFamily: fonts.display },
  label: { fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 1.2, marginTop: 4 },
});
