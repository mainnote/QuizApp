import { createStore } from './createStore';
import { findChapters } from './util';
import { LOG } from '../config';

const initialState = {
    quizzes: [],
    chapters: [],
    questions: [],
    books: [],
    current_index: {
        quizzes: -1,
        chapters: -1,
        // questions: -1, // not in use
    },
    current_result: null, // here the result is the answer of each question
    chapter_results: {}, // here the result is the answer of each question
};

const ACTION_TYPE = {
    ADD: 'ADD',
    ADD_ALL: 'ADD_ALL',
    UPDATE_INIT_INDICE: 'UPDATE_INIT_INDICE',
    UPDATE_CURRENT_INDEX: 'UPDATE_CURRENT_INDEX',
    SET_CURRENT_RESULT: 'SET_IS_COMPLETED',
    RESET: 'RESET',
    SET_NEXT_CHAPTER: 'SET_NEXT_CHAPTER',
};

const Reducer = ( state, action ) => {
    LOG( 'Reducer: quizzes, action: ', action );
    LOG( 'Reducer: state: ', state );

    switch ( action.type ) {
        case ACTION_TYPE.ADD:
            let values = [];
            if ( Array.isArray( action.data ) ) {
                values = [ ...state[ action.key ], ...action.data ];
            } else {
                values = [ ...state[ action.key ], action.data ];
            }

            return {
                ...state,
                [ action.key ]: values,
            };
        case ACTION_TYPE.ADD_ALL:
            // add each key
            let all_values = {};
            action.keys.forEach( ( key, index ) => {
                all_values[ key ] = [ ...state[ key ], ...action.data[ index ] ];
            } );

            let newState = {
                ...state,
                ...all_values,
            };
            // set current index
            // set the first chapter if the current_index is not set
            let chapters = findChapters( newState, action.quizId );
            newState.current_index.quizzes = action.quizId;
            // check if the results for its latest chapter
            // if no results for this quiz, choose the first chapter
            if ( chapters.length > 0 ) {
                let lastestChapter, lastChapter;
                // if the chapter do not have result, set as the current chapter
                for (const chapter of chapters) {
                    if (newState.chapter_results.hasOwnProperty(chapter.id) ) {
                        lastChapter = chapter.id;
                    } else {
                        lastestChapter = chapter.id;
                        break;
                    }
                }
                if (lastestChapter || lastChapter) {
                    newState.current_index.chapters = lastestChapter || lastChapter;    
                } else {
                    newState.current_index.chapters = chapters[ 0 ].id;
                }
            }
                

            return newState;
        case ACTION_TYPE.UPDATE_INIT_INDICE:
            // add each key
            let all_index_values = {};
            action.keys.forEach( ( key, index ) => {
                all_index_values[ key ] = action.indice_data[ index ];
            } );

            return {
                ...state,
                current_index: {
                    ...state.current_index,
                    ...all_index_values,
                },
            };
        case ACTION_TYPE.UPDATE_CURRENT_INDEX:
            return {
                ...state,
                current_index: {
                    ...state.current_index,
                    [ action.key ]: action.index,
                },
            };
        case ACTION_TYPE.RESET:
            return {
                ...state,
                [ action.key ]: [],
                current_index: {
                    ...state.current_index,
                    [ action.key ]: -1,
                },
                current_result: null,
            };
        case ACTION_TYPE.SET_CURRENT_RESULT:
            return {
                ...state,
                current_result: action.value,
                chapter_results: {
                    ...state.chapter_results,
                    [state.current_index.chapters]: action.value,
                },
            };
        case ACTION_TYPE.SET_NEXT_CHAPTER:
            return {
                ...state,
                current_index: {
                    ...state.current_index,
                    chapters: action.nextChapter,
                },
                current_result: null,
            };
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
