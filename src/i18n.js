import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    zh: {
        translation: {
            'biblestudy': '圣经知识测试网',
            'home': '主页',
            'quiz': '测试',
            'result': '统计',
            'terms': '免责声明',
            'privacy': '隐私政策',
            'start': '开始测试',
            'new_quiz': '最新测试题目',
            'aboutus': '关于我们',
            'aboutus_content': '我们致力于信徒对圣经知识的提高而努力。',
            'address': '8810-65 AVE NW, EDMONTON, AB T6E 0J7',
            'phonenumber': '(780) 465-3222',
            'contact_email': 'learn@eccc.ca',
            'search': '搜索',
            'search_placeholder': '我想找......',
            'mark_count': '记分方法',
            'new_post': '最新推荐阅读',
            'next_chapter': '继续测试下一节',
            'redo': '重新测试这一节',
            'all_answers': '显示所有答案',
            'wrong_answers': '仅显示错误答案',
            'result_text': '共<%= total %>题目里，答对了<%= corrected %>道题。',
            'right': '正确',
            'wrong': '再想想',
            'check_result': '查看总成绩',
            'login': '登录',
            'signup': '注册',
            'logout': '退出',
            'email': '电子邮箱',
            'password': '密码',
            'password_again': '再输入密码',
            'login_reason': '登录后可以保存测试的结果。谢谢您的帮助！', 
            'invalid_email': '电子邮箱输入不正确',
            'password_not_same': '输入的密码不一致',
            'username': '用户名',
            'invlid_username': '无效的用户名',
            'Auth.form.error.email.taken': '电子邮箱已经注册了。',
            'Auth.form.error.invalid': '登录信息不正确。',
            'system_error': '系统错误，请稍后再试。',
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