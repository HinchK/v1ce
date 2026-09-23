import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";

const PERKS = [
  ["award", "GOLD & BLUE COINS", "Unlock trophy Gold and prestige Blue coin colors."],
  ["circle", "ALL SHAPES", "Hexagon, octagon, shield, diamond, star, and more."],
  ["users", "8 FRIEND SLOTS", "Connect with up to 8 people on their journeys."],
  ["message-circle", "LOUNGE ACCESS", "Join community chat in real time."],
  ["image", "COIN PHOTO", "Upload a photo to your coin face."],
  ["bar-chart-2", "ADVANCED STATS", "Weekly charts, streaks, and milestone tracking."],
] as const;

export default function Premium() {
  const { profile } = useAuth();
  const colors = useColors();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const isPremium = !!profile?.is_premium;

  const checkout = async () => {
    if (isPremium || loading) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan, successUrl: "v1ce://premium?success=1", cancelUrl: "v1ce://premium" },
    });
    setLoading(false);
    if (error || !data?.url) {
      Alert.alert("V1CE", error?.message || "Checkout is not available yet.");
      return;
    }
    Linking.openURL(data.url);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>PREMIUM{"\n"}HUB.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>$3.99/mo · everything unlocked.</Text>
      {isPremium ? (
        <View style={[styles.badge, { borderColor: colors.gold, backgroundColor: colors.gold }]}>
          <Text style={{ color: colors.goldForeground, fontWeight: "900", letterSpacing: 2 }}>YOU ARE PREMIUM</Text>
        </View>
      ) : (
        <>
          <View style={styles.plans}>
            <TouchableOpacity onPress={() => setPlan("monthly")} style={[styles.plan, { borderColor: plan === "monthly" ? colors.foreground : colors.border }]}>
              <Text style={[styles.planTitle, { color: colors.foreground }]}>$3.99/MO</Text>
              <Text style={[styles.planSub, { color: colors.mutedForeground }]}>Monthly access</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPlan("yearly")} style={[styles.plan, { borderColor: plan === "yearly" ? colors.foreground : colors.border }]}>
              <Text style={[styles.planTitle, { color: colors.foreground }]}>YEARLY</Text>
              <Text style={[styles.planSub, { color: colors.mutedForeground }]}>Best value</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={checkout} style={[styles.button, { backgroundColor: colors.gold, opacity: loading ? 0.5 : 1 }]}>
            <Text style={{ color: colors.goldForeground, fontWeight: "900", letterSpacing: 2 }}>{loading ? "OPENING..." : "UPGRADE NOW"}</Text>
          </TouchableOpacity>
        </>
      )}
      {PERKS.map(([icon, title, desc], i) => (
        <View key={title} style={[styles.perk, { borderBottomColor: colors.border }]}>
          <View style={[styles.icon, { borderColor: colors.foreground }]}>
            <Feather name={icon} size={16} color={colors.foreground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.perkTitle, { color: colors.foreground }]}>{i + 1}. {title}</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 55, paddingBottom: 100 },
  title: { fontSize: 52, fontWeight: "900", lineHeight: 52 },
  subtitle: { fontSize: 15, marginTop: 16 },
  badge: { borderWidth: 2, padding: 12, alignSelf: "flex-start", marginTop: 24 },
  plans: { flexDirection: "row", gap: 8, marginTop: 24 },
  plan: { flex: 1, borderWidth: 2, padding: 14, minHeight: 82 },
  planTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  planSub: { fontSize: 10, marginTop: 6 },
  button: { height: 56, alignItems: "center", justifyContent: "center", marginTop: 16 },
  perk: { flexDirection: "row", gap: 14, paddingVertical: 18, borderBottomWidth: 1, alignItems: "center" },
  icon: { width: 32, height: 32, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  perkTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  desc: { fontSize: 12, lineHeight: 18, marginTop: 4 },
});
