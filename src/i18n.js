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
            'result': '统计',
            'terms' : '免责声明',
            'privacy': '隐私政策',
            'start':'开始测试',
            'new_quiz': '最新测试题目',
            'aboutus': '关于我们',
            'aboutus_content': '我们致力于信徒对圣经知识的提高而努力。',
            'address' : '8810-65 AVE NW, EDMONTON, AB T6E 0J7',
            'phonenumber': '(780) 465-3222',
            'email': 'learn@eccc.ca',
            'search': '搜索',
            'search_placeholder': '我想找......',
            'mark_count': '记分方法',
            'new_post': '最新推荐阅读',
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