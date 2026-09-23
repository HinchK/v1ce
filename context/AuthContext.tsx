import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase, TABLES, type SobrietyProfile } from "@/lib/supabase";

interface AuthContextType {
  user: { email: string; id: string } | null;
  profile: SobrietyProfile | null;
  isLoading: boolean;
  setProfile: (p: SobrietyProfile | null) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  setProfile: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function loadProfileByIdentity(userId?: string, email?: string) {
  if (userId) {
    const { data } = await supabase.from(TABLES.SobrietyProfile).select("*").eq("id", userId).maybeSingle();
    if (data) return data as SobrietyProfile;
  }
  if (email) {
    const { data } = await supabase.from(TABLES.SobrietyProfile).select("*").eq("email", email).maybeSingle();
    if (data) return data as SobrietyProfile;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [profile, setProfile] = useState<SobrietyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    const email = user?.email || (await AsyncStorage.getItem("v1ce_email")) || "";
    const loaded = await loadProfileByIdentity(user?.id, email);
    setProfile(loaded);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      let {
        data: { session },
      } = await supabase.auth.getSession();
      const guestEmail = (await AsyncStorage.getItem("v1ce_email")) || "";
      if (!session) {
        const { data } = await supabase.auth.signInAnonymously();
        session = data.session;
      }
      if (!mounted) return;
      if (session?.user?.id) {
        const email = session.user.email || guestEmail;
        setUser({ email, id: session.user.id });
        const loaded = await loadProfileByIdentity(session.user.id, email);
        if (mounted) setProfile(loaded);
      } else if (guestEmail) {
        setUser({ email: guestEmail, id: guestEmail });
        const loaded = await loadProfileByIdentity(undefined, guestEmail);
        if (mounted) setProfile(loaded);
      }
      if (mounted) setIsLoading(false);
    };
    init();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      if (session?.user?.id) {
        AsyncStorage.getItem("v1ce_email").then((stored) => {
          if (!mounted) return;
          const email = session.user.email || stored || "";
          setUser({ email, id: session.user.id });
          loadProfileByIdentity(session.user.id, email).then((loaded) => {
            if (mounted) setProfile(loaded);
          });
        });
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("v1ce_email");
    setUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ user, profile, isLoading, setProfile, signOut, refreshProfile }),
    [user, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
