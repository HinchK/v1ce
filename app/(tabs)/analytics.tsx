import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function Analytics() {
  const { profile } = useAuth();
  const c = useColors();
  const days = useMemo(() => profile?.sobriety_date ? Math.max(0, Math.floor((Date.now() - new Date(profile.sobriety_date + "T00:00:00").getTime()) / 86400000)) : 0, [profile]);
  const week = [0, 0, 0, 0, 0, 0, 0];
  const today = new Date().getDay();
  week[today === 0 ? 6 : today - 1] = 1;
  const longest = days;
  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={s.container}>
      <Text style={[s.kicker, { color: c.mutedForeground }]}>YOUR</Text>
      <Text style={[s.title, { color: c.foreground }]}>STATS.</Text>
      <View style={s.chart}>
        {week.map((v, i) => (
          <View key={i} style={s.barWrap}>
            <View style={[s.bar, { height: 28 + v * 92, backgroundColor: v ? c.gold : c.border }]} />
            <Text style={[s.day, { color: c.mutedForeground }]}>{["M","T","W","T","F","S","S"][i]}</Text>
          </View>
        ))}
      </View>
      <View style={s.grid}>
        <Stat label="LONGEST STREAK" value={longest ? `${longest}d` : "—"} c={c} />
        <Stat label="TOTAL CHECK-INS" value="0" c={c} />
        <Stat label="THIS WEEK" value={week.reduce((a, b) => a + b, 0).toString()} c={c} />
        <Stat label="MILESTONES" value={days ? Math.floor(days / 30) : 0} c={c} />
      </View>
      <Text style={[s.note, { color: c.mutedForeground }]}>Check-ins and milestone history will populate as those records are created.</Text>
    </ScrollView>
  );
}
function Stat({ label, value, c }: { label: string; value: string | number; c: any }) {
  return <View style={[s.card, { borderColor: c.border }]}><Text style={[s.label, { color: c.mutedForeground }]}>{label}</Text><Text style={[s.value, { color: c.foreground }]}>{value}</Text></View>;
}
const s = StyleSheet.create({
  container:{padding:20,paddingTop:55,paddingBottom:80}, kicker:{fontSize:12,letterSpacing:5,fontWeight:"700"}, title:{fontSize:52,fontWeight:"900",lineHeight:54,marginBottom:24},
  chart:{height:150,borderBottomWidth:2,borderBottomColor:"#888",flexDirection:"row",alignItems:"flex-end",justifyContent:"space-around",paddingHorizontal:8},
  barWrap:{height:145,alignItems:"center",justifyContent:"flex-end",gap:6},bar:{width:28,minHeight:4},day:{fontSize:9,letterSpacing:2,fontWeight:"700"},
  grid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:24},card:{width:"48%",borderWidth:2,padding:16,minHeight:105},label:{fontSize:9,letterSpacing:1.5,fontWeight:"700"},value:{fontSize:28,fontWeight:"900",marginTop:12},note:{fontSize:12,lineHeight:18,marginTop:24}
});