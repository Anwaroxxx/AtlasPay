import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            dashboard: 'Dashboard',
            send_money: 'Send Money',
            history: 'Transactions',
            credits_loans: 'Credits & Loans',
            daret: 'Daret Groups',
            ai_assistant: 'AI Assistant',
            profile: 'My Profile',
            main_menu: 'Main Menu',
        },
    },
    fr: {
        translation: {
            dashboard: 'Tableau de bord',
            send_money: "Envoyer de l'argent",
            history: 'Transactions',
            credits_loans: 'Crédits & Prêts',
            daret: 'Groupes Daret',
            ai_assistant: 'Assistant IA',
            profile: 'Mon Profil',
            main_menu: 'Menu Principal',
        },
    },
    ar: {
        translation: {
            dashboard: 'لوحة القيادة',
            send_money: 'إرسال الأموال',
            history: 'العمليات',
            credits_loans: 'الائتمان والقروض',
            daret: 'مجموعات دارت',
            ai_assistant: 'مساعد الذكاء الاصطناعي',
            profile: 'ملفي الشخصي',
            main_menu: 'القائمة الرئيسية',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

console.log('SmartBanking I18N Initialized');

export default i18n;
