import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import arTranslation from "../locals/ar/index.json";
import trTranslation from "../locals/tr/index.json";
import deTranslation from "../locals/de/index.json";

i18next.use(initReactI18next).init({
    resources: {
        ar: { translation: arTranslation },
        tr: { translation: trTranslation },
        de: { translation: deTranslation },
    },
    lng: "en",
    fallbackLng: "en",
});

export default i18next;