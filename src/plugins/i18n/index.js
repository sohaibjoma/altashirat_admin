import { createI18n } from 'vue-i18n';
import en from "./en.json";
import ar from "./ar.json";

const i18n = createI18n({
  locale: localStorage.getItem("locale") || "ar",
  fallbackLocale: 'ar',
  messages: {
    en,
    ar,
  },
});


export const t = i18n.global.t; 
export default i18n; 