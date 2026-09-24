import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18N_RESOURCES, type I18nLang } from "@/lib/i18n-resources";

export const LANGUAGES = [
  { code: "en" as const, label: "EN" },
  { code: "ko" as const, label: "한" },
  { code: "es" as const, label: "ES" },
  { code: "vi" as const, label: "VI" },
  { code: "zh" as const, label: "中" },
  { code: "am" as const, label: "አማ" },
];

export type LangCode = I18nLang;

type I18nValue = {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
  tList: (key: string) => string[];
};

function lookup(lang: LangCode, key: string): string | string[] | undefined {
  const table = I18N_RESOURCES[lang] || I18N_RESOURCES.en;
  const value = table[key];
  if (value !== undefined) return value;
  return I18N_RESOURCES.en[key];
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  tList: () => [],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    AsyncStorage.getItem("v1ce_lang").then((stored) => {
      if (stored && stored in I18N_RESOURCES) setLangState(stored as LangCode);
    });
  }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    void AsyncStorage.setItem("v1ce_lang", code);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => {
        const v = lookup(lang, key);
        return typeof v === "string" ? v : Array.isArray(v) ? v[0] || key : key;
      },
      tList: (key: string) => {
        const v = lookup(lang, key);
        return Array.isArray(v) ? v : typeof v === "string" ? [v] : [];
      },
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
