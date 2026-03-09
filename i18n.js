import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";
import zhHant from "./locales/zh-Hant.json";
import tarotEn from "./locales/tarot-en.json";
import tarotZhHans from "./locales/tarot-zh-Hans.json";
import tarotZhHant from "./locales/tarot-zh-Hant.json";

i18n.use(initReactI18next).init({
  resources: {
    en:        { translation: { ...en,     tarot: tarotEn     } },
    "zh-Hans": { translation: { ...zhHans, tarot: tarotZhHans } },
    "zh-Hant": { translation: { ...zhHant, tarot: tarotZhHant } },
  },
  lng: "zh-Hans",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
