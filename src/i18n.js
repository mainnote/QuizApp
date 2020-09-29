import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    zh: {
        translation: {
            'biblestudy' : '圣经知识测试网',
            'home': '主页',
            'quiz': '测试',
            'result': '测试统计',
            'terms' : '免责声明',
            'privacy': '隐私政策',
            'start':'开始测试',
            'new_quiz': '最新测试题目',
        }
    }
};

i18n
    .use( initReactI18next ) // passes i18n down to react-i18next
    .init( {
        resources,
        lng: "zh",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    } );

export default i18n;