import { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, defaultProfileFields } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUBSTANCES } from "@/constants/app";

const STEPS = ["Welcome", "Email", "Date", "Substances"];

function formatDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
function toDatabaseDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : "";
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [eula, setEula] = useState(false);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [substances, setSubstances] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, setProfile } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const toggleSubstance = useCallback((s: string) => {
    setSubstances((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }, []);

  const persistProfile = async (values: Record<string, unknown>, storedEmail: string) => {
    await AsyncStorage.setItem("v1ce_email", storedEmail);
    const payload = { ...defaultProfileFields, ...values, id: user?.id, email: storedEmail };
    const { data, error } = await supabase.from(TABLES.SobrietyProfile).upsert(payload).select().single();
    if (error) {
      Alert.alert("Error", error.message || "Could not save profile. Please try again.");
      return false;
    }
    setProfile(data);
    router.replace("/(tabs)");
    return true;
  };

  const handleSave = async () => {
    const sobrietyDate = toDatabaseDate(date);
    if (!sobrietyDate || isSaving) return;
    setIsSaving(true);
    await persistProfile(
      { display_name: name.trim(), sobriety_date: sobrietyDate, substances, email: email.trim().toLowerCase() },
      email.trim().toLowerCase()
    );
    setIsSaving(false);
  };

  const step0Valid = name.trim().length > 0 && eula;
  const step2Valid = /^\d{2}\/\d{2}\/\d{4}$/.test(date);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.stepIndicator}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.stepDot, { backgroundColor: i <= step ? colors.foreground : colors.border }]} />
        ))}
      </View>
      {step === 0 && (
        <>
          <Text style={[styles.title, { color: colors.foreground }]}>WELCOME{"\n"}TO V1CE</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Your sobriety journey starts here.</Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>YOUR NAME</Text>
          <TextInput value={name} onChangeText={setName} maxLength={20} style={[styles.input, { borderColor: colors.foreground, color: colors.foreground }]} placeholder="Enter your name" placeholderTextColor={colors.mutedForeground} autoCapitalize="words" />
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setEula(!eula)}>
            <View style={[styles.checkbox, { borderColor: colors.foreground, backgroundColor: eula ? colors.foreground : "transparent" }]}>
              {eula ? <Feather name="check" size={12} color={colors.background} /> : null}
            </View>
            <Text style={[styles.checkboxText, { color: colors.mutedForeground }]}>I agree to the Terms of Use</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.foreground }, !step0Valid && styles.buttonDisabled]} disabled={!step0Valid} onPress={() => setStep(1)}>
            <Text style={[styles.buttonText, { color: colors.background }]}>NEXT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: colors.mutedForeground }]}
            onPress={async () => {
              const demoEmail = "demo@v1ce.app";
              await persistProfile(
                {
                  display_name: "Demo User",
                  sobriety_date: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0],
                  substances: ["Alcohol", "Nicotine"],
                  coin_color: "#F5D680",
                  coin_motto: "ONE DAY AT A TIME",
                },
                demoEmail
              );
            }}
          >
            <Text style={[styles.outlineButtonText, { color: colors.mutedForeground }]}>DEMO MODE</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 1 && (
        <>
          <Text style={[styles.title, { color: colors.foreground }]}>WHAT&apos;S YOUR{"\n"}EMAIL?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>We&apos;ll save your profile and send milestone updates.</Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>EMAIL</Text>
          <TextInput value={email} onChangeText={setEmail} style={[styles.input, { borderColor: colors.foreground, color: colors.foreground }]} placeholder="your@email.com" placeholderTextColor={colors.mutedForeground} keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.backButton, { borderColor: colors.foreground }]} onPress={() => setStep(0)}>
              <Text style={[styles.backButtonText, { color: colors.foreground }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: colors.foreground }, !email.includes("@") && styles.buttonDisabled]} disabled={!email.includes("@")} onPress={() => setStep(2)}>
              <Text style={[styles.buttonText, { color: colors.background }]}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={[styles.title, { color: colors.foreground }]}>WHEN DID YOU{"\n"}START?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Select your sobriety start date.</Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>SOBRIETY DATE</Text>
          <TextInput value={date} onChangeText={(v) => setDate(formatDate(v))} maxLength={10} keyboardType="number-pad" style={[styles.input, { borderColor: colors.foreground, color: colors.foreground }]} placeholder="MM/DD/YYYY" placeholderTextColor={colors.mutedForeground} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.backButton, { borderColor: colors.foreground }]} onPress={() => setStep(1)}>
              <Text style={[styles.backButtonText, { color: colors.foreground }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: colors.foreground }, !step2Valid && styles.buttonDisabled]} disabled={!step2Valid} onPress={() => setStep(3)}>
              <Text style={[styles.buttonText, { color: colors.background }]}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={[styles.title, { color: colors.foreground }]}>WHAT ARE YOU{"\n"}QUITTING?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Select all that apply. You can change this later.</Text>
          <View style={styles.chipWrap}>
            {SUBSTANCES.map((s) => {
              const selected = substances.includes(s);
              return (
                <TouchableOpacity key={s} style={[styles.substanceChip, { borderColor: colors.foreground, backgroundColor: selected ? colors.foreground : "transparent" }]} onPress={() => toggleSubstance(s)}>
                  <Text style={{ color: selected ? colors.background : colors.foreground, fontWeight: "600" }}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.backButton, { borderColor: colors.foreground }]} onPress={() => setStep(2)}>
              <Text style={[styles.backButtonText, { color: colors.foreground }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: colors.foreground }, isSaving && styles.buttonDisabled]} disabled={isSaving} onPress={handleSave}>
              <Text style={[styles.buttonText, { color: colors.background }]}>{isSaving ? "SAVING..." : "DONE"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  stepIndicator: { flexDirection: "row", gap: 8, marginBottom: 32 },
  stepDot: { flex: 1, height: 4, borderRadius: 2 },
  title: { fontSize: 48, fontWeight: "700", lineHeight: 52, marginBottom: 8, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, marginBottom: 32 },
  label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 },
  input: { borderWidth: 2, backgroundColor: "transparent", padding: 12, fontSize: 18, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 24 },
  checkbox: { width: 20, height: 20, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  checkboxText: { fontSize: 12, flex: 1 },
  button: { marginTop: "auto", height: 56, justifyContent: "center", alignItems: "center" },
  buttonDisabled: { opacity: 0.3 },
  buttonText: { fontSize: 20, fontWeight: "700", letterSpacing: 2, fontFamily: "Inter_700Bold" },
  outlineButton: { marginTop: 12, height: 40, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  outlineButtonText: { fontSize: 16, fontWeight: "700", letterSpacing: 1, fontFamily: "Inter_700Bold" },
  backButton: { flex: 1, height: 56, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  backButtonText: { fontSize: 18, fontWeight: "700", letterSpacing: 1, fontFamily: "Inter_700Bold" },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: "auto" },
  substanceChip: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 2, marginRight: 8, marginBottom: 8 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap" },
});
