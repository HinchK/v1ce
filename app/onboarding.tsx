import { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, defaultProfileFields } from "@/lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_SUBSTANCES } from "@/constants/app";
import { fonts } from "@/constants/typography";
import CalendarField from "@/components/onboarding/CalendarField";
import { useTranslation } from "@/lib/i18n";

const SUBSTANCE_KEYS: Record<string, string> = {
  Alcohol: "alcohol",
  Cannabis: "cannabis",
  Cocaine: "cocaine",
  Opioids: "opioids",
  Meth: "methamphetamine",
  Benzodiazepines: "benzodiazepines",
  Nicotine: "nicotine",
  Sugar: "sugar",
  Gambling: "gambling",
  Other: "other",
};

export default function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [eula, setEula] = useState(false);
  const [date, setDate] = useState("");
  const [substances, setSubstances] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, setProfile } = useAuth();
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
    if (!date || isSaving) return;
    setIsSaving(true);
    const guestEmail = user?.email || `${name.trim().toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@guest.v1ce.app`;
    await persistProfile(
      {
        display_name: name.trim(),
        sobriety_date: date,
        substances,
        email: guestEmail,
        coin_color: "#F5D680",
      },
      guestEmail
    );
    setIsSaving(false);
  };

  const step0Valid = name.trim().length > 0 && eula;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={[styles.screen, { paddingTop: insets.top + 36 }]}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <>
            <Text style={styles.title}>{t("onboarding.welcome")}</Text>
            <Text style={styles.subtitle}>{t("onboarding.welcomeSub")}</Text>
            <Text style={styles.label}>{t("onboarding.nameLabel").toUpperCase()}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={20}
              style={styles.input}
              placeholder={t("onboarding.namePlaceholder")}
              placeholderTextColor="#A3A3A3"
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setEula(!eula)}>
              <View style={[styles.checkbox, eula && styles.checkboxOn]}>
                {eula ? <Feather name="check" size={14} color="#F3F3F3" /> : null}
              </View>
              <Text style={styles.checkboxText}>{t("onboarding.eulaText")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !step0Valid && styles.buttonDisabled]}
              disabled={!step0Valid}
              onPress={() => setStep(1)}
            >
              <Text style={styles.buttonText}>{t("onboarding.next")}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.title}>{t("onboarding.whenDidYouStart")}</Text>
            <Text style={styles.subtitle}>{t("onboarding.whenSub")}</Text>
            <Text style={styles.label}>{t("onboarding.sobrietyDate").toUpperCase()}</Text>
            <CalendarField value={date} onChange={setDate} />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(0)}>
                <Text style={styles.backButtonText}>{t("onboarding.back")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonFlex, !date && styles.buttonDisabled]}
                disabled={!date}
                onPress={() => setStep(2)}
              >
                <Text style={styles.buttonText}>{t("onboarding.next")}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>{t("onboarding.whatsYourDoc")}</Text>
            <Text style={styles.subtitle}>{t("onboarding.whatsYourDocSub")}</Text>
            <View style={styles.grid}>
              {ONBOARDING_SUBSTANCES.map((s) => {
                const selected = substances.includes(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.subCell, selected && styles.subCellOn]}
                    onPress={() => toggleSubstance(s)}
                  >
                    <Text style={[styles.subText, selected && styles.subTextOn]}>
                      {t(`substances.${SUBSTANCE_KEYS[s] || s.toLowerCase()}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Text style={styles.backButtonText}>{t("onboarding.back")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonFlex, isSaving && styles.buttonDisabled]}
                disabled={isSaving}
                onPress={handleSave}
              >
                <Text style={styles.journey}>{isSaving ? "..." : t("onboarding.startJourney")}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { paddingHorizontal: 24, flexGrow: 1, width: "100%", maxWidth: 430, alignSelf: "center" },
  title: { fontSize: 56, lineHeight: 54, fontFamily: fonts.display, color: "#0A0A0A", marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#737373", fontFamily: fonts.body, marginBottom: 32 },
  label: { fontSize: 10, letterSpacing: 2, color: "#737373", fontFamily: fonts.bodyBold, marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: "#0A0A0A",
    backgroundColor: "#FFFFFF",
    padding: 14,
    fontSize: 18,
    fontFamily: fonts.bodySemi,
    color: "#0A0A0A",
  },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginTop: 24 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: "#0A0A0A", alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkboxOn: { backgroundColor: "#0A0A0A" },
  checkboxText: { flex: 1, fontSize: 13, lineHeight: 18, color: "#737373", fontFamily: fonts.body },
  button: { marginTop: "auto", height: 56, justifyContent: "center", alignItems: "center", backgroundColor: "#0A0A0A" },
  buttonFlex: { flex: 1, marginTop: 0 },
  buttonDisabled: { backgroundColor: "#C8C8C8" },
  buttonText: { fontSize: 22, letterSpacing: 2, fontFamily: fonts.display, color: "#F7F7F7" },
  journey: { fontSize: 18, lineHeight: 20, letterSpacing: 1, fontFamily: fonts.display, color: "#F7F7F7", textAlign: "center" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: "auto" },
  backButton: { flex: 1, height: 56, backgroundColor: "#E4E4E4", justifyContent: "center", alignItems: "center" },
  backButtonText: { fontSize: 18, letterSpacing: 1, fontFamily: fonts.display, color: "#0A0A0A" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  subCell: {
    width: "48.4%",
    minHeight: 48,
    borderWidth: 2,
    borderColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  subCellOn: { backgroundColor: "#0A0A0A" },
  subText: { fontSize: 14, fontFamily: fonts.body, color: "#0A0A0A" },
  subTextOn: { color: "#FFFFFF" },
});
