import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "ES" },
  { code: "vi", label: "VI" },
  { code: "zh", label: "中" },
  { code: "am", label: "አማ" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

const STRINGS: Record<LangCode, Record<string, string>> = {
  en: {
    "home.customize": "CUSTOMIZE →",
    "home.timeElapsed": "TIME\nELAPSED",
    "home.soberSince": "Sober Since",
    "home.whatsYourDoc": "WHAT'S\nYOUR DOC?",
    "home.yourMilestones": "YOUR\nMILESTONES.",
    "calendar.addToCalendar": "ADD TO CALENDAR",
    "nav.home": "Home",
    "nav.coin": "Coin",
    "nav.stats": "Stats",
    "nav.lounge": "Lounge",
    "nav.friends": "Friends",
    "nav.profile": "Profile",
    "nav.premium": "Premium",
  },
  ko: {
    "home.customize": "꾸미기 →",
    "home.timeElapsed": "경과\n시간",
    "home.soberSince": "시작일",
    "home.whatsYourDoc": "무엇을\n끊고 있나요?",
    "home.yourMilestones": "당신의\n마일스톤.",
    "calendar.addToCalendar": "캘린더에 추가",
    "nav.home": "홈",
    "nav.coin": "코인",
    "nav.stats": "통계",
    "nav.lounge": "라운지",
    "nav.friends": "친구",
    "nav.profile": "프로필",
    "nav.premium": "프리미엄",
  },
  es: {
    "home.customize": "PERSONALIZAR →",
    "home.timeElapsed": "TIEMPO\nTRANSCURRIDO",
    "home.soberSince": "Sobrio desde",
    "home.whatsYourDoc": "¿QUÉ ESTÁS\nDEJANDO?",
    "home.yourMilestones": "TUS\nHITOS.",
    "calendar.addToCalendar": "AÑADIR AL CALENDARIO",
    "nav.home": "Inicio",
    "nav.coin": "Moneda",
    "nav.stats": "Stats",
    "nav.lounge": "Lounge",
    "nav.friends": "Amigos",
    "nav.profile": "Perfil",
    "nav.premium": "Premium",
  },
  vi: {
    "home.customize": "TÙY CHỈNH →",
    "home.timeElapsed": "THỜI GIAN\nĐÃ QUA",
    "home.soberSince": "Bắt đầu từ",
    "home.whatsYourDoc": "BẠN ĐANG\nCAI GÌ?",
    "home.yourMilestones": "CỘT MỐC\nCỦA BẠN.",
    "calendar.addToCalendar": "THÊM VÀO LỊCH",
    "nav.home": "Home",
    "nav.coin": "Xu",
    "nav.stats": "Stats",
    "nav.lounge": "Lounge",
    "nav.friends": "Bạn bè",
    "nav.profile": "Hồ sơ",
    "nav.premium": "Premium",
  },
  zh: {
    "home.customize": "自定义 →",
    "home.timeElapsed": "已过\n时间",
    "home.soberSince": "开始日期",
    "home.whatsYourDoc": "你在戒\n什么？",
    "home.yourMilestones": "你的\n里程碑.",
    "calendar.addToCalendar": "添加到日历",
    "nav.home": "首页",
    "nav.coin": "硬币",
    "nav.stats": "数据",
    "nav.lounge": "会客厅",
    "nav.friends": "朋友",
    "nav.profile": "资料",
    "nav.premium": "高级",
  },
  am: {
    "home.customize": "አስተካክል →",
    "home.timeElapsed": "ያለፈ\nጊዜ",
    "home.soberSince": "ከጀመርክበት",
    "home.whatsYourDoc": "ምን እየተውክ\nነው?",
    "home.yourMilestones": "የአንተ\nምዕራፎች.",
    "calendar.addToCalendar": "ወደ ቀን መቁጠሪያ ጨምር",
    "nav.home": "መነሻ",
    "nav.coin": "ሳንቲም",
    "nav.stats": "መረጃ",
    "nav.lounge": "ላውንጅ",
    "nav.friends": "ጓደኞች",
    "nav.profile": "መገለጫ",
    "nav.premium": "ፕሪሚየም",
  },
};

type I18nValue = {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    AsyncStorage.getItem("v1ce_lang").then((stored) => {
      if (stored && stored in STRINGS) setLangState(stored as LangCode);
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
      t: (key: string) => STRINGS[lang][key] || STRINGS.en[key] || key,
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
