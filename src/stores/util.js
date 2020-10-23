import { template } from 'lodash';
import {
    DEBUG, DEBUG_NUM,
    API_ALL_QUIZZES, API_ALL_CHAPTERS, API_ALL_QUESTIONS,
    API_ALL_BOOKS, API_ALL_RESULTS, OLD_TESTAMENT, NEW_TESTAMENT,
    API_STATISTICS,
} from '../config';
import { requestGet, requestPost, requestGetWithDispatch } from '../stores/request';
import { ACTION_TYPE as ACTION_TYPE_QUIZ, } from '../stores/quizStore';
import { isEqual, sortBy, map, concat } from 'lodash';
import { ACTION_TYPE as ACTION_TYPE_WEBSITE } from './websiteStore';

const chapterHtml = template( '<h5><%= title %></h5><p><%= duration %></p><p><%= reminds %></p><div class="h6"><%= description %></div>' );
const findChapters = ( state ) => {
    return state.chapters.filter( c => c.quiz.id === state.current_index.quizzes ).sort( ( a, b ) => a.chapter_no - b.chapter_no );
};

const findNextChapter = ( state ) => {
    let chapter_id = state.current_index.chapters;

    let chapters = findChapters( state );
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
        let quiz = state.quizzes.find( z => z.id === quiz_id );

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
                !state.chapters.some( c => c.quiz.id === quizId ) ) {
                return requestGet( API_ALL_CHAPTERS + '?quiz=' + quizId + '&_limit=-1&_sort=chapter_no:ASC' );
            } else {
                return Promise.resolve( { data: [] } );
            }

        }
        // all questions for this quiz
        function loadQuestions( quizId ) {
            if ( state.questions.length === 0
                || !state.questions.some( q => q.chapter.quiz === quizId ) ) {
                return requestGet( API_ALL_QUESTIONS + '?chapter.quiz=' + quizId + '&_limit=-1&_sort=question_no:ASC' );
            } else {
                return Promise.resolve( { data: [] } );
            }
        }

        // process
        loadBooks().then( res_books => {
            return loadQuizzes().then( res0 => {
                return loadChapters( quiz_id ).then( res1 => {
                    return loadQuestions( quiz_id ).then( res2 => {
                        dispatch( {
                            type: ACTION_TYPE_QUIZ.ADD_ALL,
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

const fetchResultAPI = ( jwt ) => {
    return requestGet( API_ALL_RESULTS, {
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    } );
};

const updateCurrentChapter = ( stateQuiz ) => {
    let chapters = findChapters( stateQuiz );

    // check if the results for its latest chapter
    // if no results for this quiz, choose the first chapter
    if ( chapters.length > 0 ) {
        let lastestChapter, lastChapter;
        // if the chapter do not have result, set as the current chapter
        for ( const chapter of chapters ) {
            if ( stateQuiz.chapter_results.hasOwnProperty( chapter.id ) ) {
                lastChapter = chapter.id;
            } else {
                lastestChapter = chapter.id;
                break;
            }
        }
        if ( lastestChapter || lastChapter ) {
            stateQuiz.current_index.chapters = lastestChapter || lastChapter;
            if ( lastestChapter || lastChapter )
                stateQuiz.current_result = stateQuiz.chapter_results[ lastestChapter || lastChapter ]
        } else {
            stateQuiz.current_index.chapters = chapters[ 0 ].id;
        }
    }
    return stateQuiz;
};

const getCurrentResultSummary = state => {
    let result = {
        old_testament: { categories: {}, total: { mark: 0, label: 'old_testament_marks_total', count: 0 } },
        new_testament: { categories: {}, total: { mark: 0, label: 'new_testament_marks_total', count: 0 } },
        all_testaments: {
            categories: {
                [ OLD_TESTAMENT ]: { mark: 0, label: OLD_TESTAMENT, count: 0 },
                [ NEW_TESTAMENT ]: { mark: 0, label: NEW_TESTAMENT, count: 0 },
            },
            total: { mark: 0, label: 'all_testament_marks_total', count: 0 }
        },
    };
    // find the current quiz and all chapters
    // go to find all questions from each chapters and see if there is a correct answer or not
    // now add the question mark to its categories which belong to 3 tables (old, new and all)
    // return the final result to the result file e.g. for each category: { mark: 0, label: 'king', count: 60 }
    let books = {};
    let old_categories = {};
    let new_categories = {};

    state.books.forEach( book => {
        books[ book.id ] = book;
        switch ( book.testament.title ) {
            case OLD_TESTAMENT:
                if ( !old_categories.hasOwnProperty( book.category.id ) )
                    old_categories[ book.category.id ] = { mark: 0, label: book.category.title, count: 0 };
                break;
            case NEW_TESTAMENT:
                if ( !new_categories.hasOwnProperty( book.category.id ) )
                    new_categories[ book.category.id ] = { mark: 0, label: book.category.title, count: 0 };
                break;
            default:
                break;
        }
    } );

    result.old_testament.categories = old_categories;
    result.new_testament.categories = new_categories;

    // start looping through each questions to find the marks
    let chapters = findChapters( state );
    chapters.forEach( c => {
        let questions = state.questions.filter( q => q.chapter.id === c.id ).sort( ( a, b ) => a.question_no - b.question_no );
        if ( DEBUG ) questions = questions.slice( 0, DEBUG_NUM );

        questions.forEach( q => {
            let correctAnswer = [];

            q.choice.forEach( i => {
                if ( i.is_answer ) correctAnswer.push( i.choice_symbol );
            } );

            if ( q.books && q.books.length > 0 ) {
                let bookOfQuestion = books[ q.books[ 0 ].id ];
                let resultTestament, resultCategory, resultAllCategory;
                switch ( bookOfQuestion.testament.title ) {
                    case OLD_TESTAMENT:
                        resultTestament = result.old_testament;
                        resultAllCategory = result.all_testaments.categories[ OLD_TESTAMENT ];
                        break;
                    case NEW_TESTAMENT:
                        resultTestament = result.new_testament;
                        resultAllCategory = result.all_testaments.categories[ NEW_TESTAMENT ];
                        break;
                    default:
                        resultTestament = null;
                }

                resultTestament.total.count++;
                result.all_testaments.total.count++;
                resultCategory = resultTestament.categories[ bookOfQuestion.category.id ];
                resultCategory.count++;
                resultAllCategory.count++;

                if ( state.chapter_results.hasOwnProperty( c.id ) && state.chapter_results[ c.id ].hasOwnProperty( q.question_no ) ) {
                    if ( isEqual( sortBy( correctAnswer ), sortBy( state.chapter_results[ c.id ][ q.question_no ] ) ) ) {
                        resultCategory.mark++;
                        resultTestament.total.mark++;
                        result.all_testaments.total.mark++;
                        resultAllCategory.mark++;
                    }
                }
            }
        } );
    } );

    // convert object to array for category
    result.old_testament.categories = map( result.old_testament.categories, c => c );
    result.new_testament.categories = map( result.new_testament.categories, c => c );
    result.all_testaments.categories = map( result.all_testaments.categories, c => c );

    return result;
};

function getPoints( total ) {
    let p = 1.0 * total.mark / total.count * 100;
    return p ? p : 0;
}

function shortenLabel( label ) {
    return label.substring( 0, 4 ).replace( '—', '' );
}

function getSeries( marks ) {
    return concat( marks.old_testament.categories, marks.new_testament.categories )
        .map( c => ( { y: shortenLabel( c.label ), x: c.count ? 1.0 * c.mark / c.count * 100 : 0 } ) ).reverse();
}

function loadResult( dispatchWebsite ) {
    requestGetWithDispatch( dispatchWebsite, API_STATISTICS, ACTION_TYPE_WEBSITE.ADD, 'statistics' );
}

export {
    stateToSurveyJS, findChapters, findNextChapter,
    loadQuizFull, getWebsiteState, sendResultAPI,
    fetchResultAPI, updateCurrentChapter, getCurrentResultSummary,
    getPoints, getSeries, loadResult,
};