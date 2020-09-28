export const DEBUG = process.env.REACT_APP_DEBUG;
export const LOG = (...messages) => {
    if (DEBUG) console.log(...messages);
};

export const BASE_API = process.env.REACT_APP_BASE_API;

export const API_ALL_QUIZZES = BASE_API + 'quizzes/';
export const API_ALL_CHAPTERS = BASE_API + 'chapters/';
export const API_ALL_QUESTIONS = BASE_API + 'questions/';
export const API_ALL_POSTS = BASE_API + 'posts/';