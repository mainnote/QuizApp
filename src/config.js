export const DEBUG = (process.env.REACT_APP_DEBUG === 'true');
export const LOG = (...messages) => {
    if (DEBUG) console.log(...messages);
};
export const DEBUG_NUM = 1;

export const BASE_API = process.env.REACT_APP_BASE_API;

export const API_ALL_QUIZZES = BASE_API + 'quizzes/';
export const API_ALL_CHAPTERS = BASE_API + 'chapters/';
export const API_ALL_QUESTIONS = BASE_API + 'questions/';
export const API_ALL_POSTS = BASE_API + 'posts/';
export const API_ALL_BOOKS = BASE_API + 'books/';
export const API_ALL_WEBSITE = BASE_API + 'website/';
export const API_ALL_RESULTS = BASE_API + 'results/';

export const REGISTER_URL = BASE_API + 'auth/local/register';
export const LOGIN_URL = BASE_API + 'auth/local';