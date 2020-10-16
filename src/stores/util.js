import { template } from 'lodash';
import {
    DEBUG, LOG, DEBUG_NUM,
    API_ALL_QUIZZES, API_ALL_CHAPTERS, API_ALL_QUESTIONS,
    API_ALL_BOOKS, API_ALL_RESULTS,
} from '../config';
import { requestGet, requestPost } from '../stores/request';
import { ACTION_TYPE, } from '../stores/quizStore';

const chapterHtml = template( '<h5><%= title %></h5><p><%= duration %></p><p><%= reminds %></p><div class="h6"><%= description %></div>' );
const findChapters = ( state, quiz_id ) => {
    return state.chapters.filter( c => c.quiz.id === quiz_id ).sort( ( a, b ) => a.chapter_no - b.chapter_no );
};

const findNextChapter = ( state, quiz_id ) => {
    let chapter_id = state.current_index.chapters;

    let chapters = findChapters( state, quiz_id );
    let isNext = false;
    chapters.forEach( c => {
        if ( c.id === chapter_id ) {
            isNext = true;
        }

        if ( isNext ) {
            return c;
        }
    } );

    return null;
};

const stateToSurveyJS = state => {
    let quiz_id = state.current_index.quizzes;
    let chapter_id = state.current_index.chapters;
    if ( quiz_id === -1 ) {
        return [ {}, null ];
    } else {
        let current_result = state.current_result;
        let isResult = current_result ? true : false;
        let quiz = state.quizzes.find( z => z.id = quiz_id );

        let survey_json = {
            "showTitle": !isResult,
            "title": quiz.title,
            "showProgressBar": isResult ? "off" : "bottom",
            "showTimerPanel": isResult ? "none" : "top",
            "firstPageIsStarted": isResult ? false : true,
            "startSurveyText": "测试开始", // TODO: move it to i18n.js
            "pages": [],
            "showCompletedPage": false,
            "showQuestionNumbers": "off",
        };

        let chapters = findChapters( state, quiz_id );
        let isNext = false;
        let nextChapter = null;
        chapters.forEach( c => {
            if ( c.id === chapter_id ) {
                if ( !isResult ) {
                    survey_json.pages.push( {
                        "elements": [
                            {
                                "type": "html",
                                "html": chapterHtml( { title: c.title, duration: c.duration, reminds: c.reminds, description: c.description } ),
                            }
                        ]
                    } );
                }

                let questions = state.questions.filter( q => q.chapter.id === c.id ).sort( ( a, b ) => a.question_no - b.question_no );
                if ( DEBUG ) questions = questions.slice( 0, DEBUG_NUM );

                questions.forEach( q => {
                    let choices = [];
                    let correctAnswer = [];

                    q.choice.forEach( i => {
                        choices.push( { "value": i.choice_symbol, "text": i.choice_symbol + '. ' + i.choice_content } );
                        if ( i.is_answer ) correctAnswer.push( i.choice_symbol );
                    } );

                    survey_json.pages.push( {
                        "elements": [
                            {
                                "type": "checkbox",
                                "name": q.question_no.toString(),
                                "title": q.question_no + '. ' + q.question_content,
                                "choices": choices,
                                "correctAnswer": correctAnswer,
                            }
                        ]
                    } );
                } );

                // set for next chapter
                isNext = true;
            }

            else if ( isNext ) {
                isNext = false;
                nextChapter = c.id;
            }
        } );

        LOG( "json:", survey_json );
        LOG( "isNext:", nextChapter );
        return [ survey_json, nextChapter ];
    }
};

const loadQuizFull = ( state, dispatch, quiz_id ) => {
    // if not load the quizzes, first chapter and the questions of the first chapter
    if ( quiz_id ) {
        // load functions
        function loadBooks() {
            if ( state.books.length === 0 ) {
                return requestGet( API_ALL_BOOKS + '?_limit=-1' );
            } else {
                return Promise.resolve( { data: [] } );
            }
        }

        // all quizzes
        function loadQuizzes() {
            if ( state.quizzes.length === 0 ) {
                return requestGet( API_ALL_QUIZZES + '?_limit=-1' );
            } else {
                return Promise.resolve( { data: [] } );
            }
        }
        // all chapters for this quiz
        function loadChapters( quizId ) {
            if ( state.chapters.length === 0 ||
                !state.chapters.some( c => c.quiz.id === quiz_id ) ) {
                return requestGet( API_ALL_CHAPTERS + '?quiz=' + quizId + '&_limit=-1&_sort=chapter_no:ASC' );
            } else {
                return Promise.resolve( { data: [] } );
            }

        }
        // all questions for this quiz
        function loadQuestions( quizId ) {
            if ( state.questions.length === 0
                || !state.questions.some( q => q.chapter.quiz === quiz_id ) ) {
                return requestGet( API_ALL_QUESTIONS + '?chapter.quiz=' + quizId + '&_limit=-1&_sort=question_no:ASC' );
            } else {
                return Promise.resolve( { data: [] } );
            }
        }

        // process
        loadBooks().then( res_books => {
            LOG( 'books:', res_books.data )
            return loadQuizzes().then( res0 => {
                LOG( 'quizzes:', res0.data )
                return loadChapters( quiz_id ).then( res1 => {
                    LOG( 'chapters:', res1.data )
                    return loadQuestions( quiz_id ).then( res2 => {
                        LOG( 'questions:', res2.data )
                        dispatch( {
                            type: ACTION_TYPE.ADD_ALL,
                            quizId: quiz_id,
                            keys: [ 'books', 'quizzes', 'chapters', 'questions' ],
                            data: [ res_books.data, res0.data, res1.data, res2.data ],
                        } );
                    } );
                } );
            } );
        } );
    }
};

function getWebsiteState( state, key ) {
    if ( state.website && state.website[ key ] && state.website[ key ].length > 0 )
        return state.website[ key ];
    return null;
}

const sendResultAPI = ( jwt, result ) => {
    return requestPost( API_ALL_RESULTS, result, {
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    } );
};

export {
    stateToSurveyJS, findChapters, findNextChapter, loadQuizFull, getWebsiteState, sendResultAPI,
};