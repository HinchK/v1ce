import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const ONBOARDING_VERSION = "3";
export const ONBOARDING_VERSION_KEY = "v1ce_onboarding_version";

export default function Index() {
  const { profile, isLoading } = useAuth();
  const [onboardingVersion, setOnboardingVersion] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_VERSION_KEY).then(setOnboardingVersion);
  }, []);

  if (isLoading || onboardingVersion === undefined) return null;

  // A profile alone must never silently bypass a newly required onboarding flow.
  if (onboardingVersion !== ONBOARDING_VERSION) {
    return <Redirect href="/onboarding" />;
  }

  if (!profile) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
