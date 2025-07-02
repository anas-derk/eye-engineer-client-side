import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import arTranslation from "../locals/ar";
import trTranslation from "../locals/tr";
import deTranslation from "../locals/de";

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