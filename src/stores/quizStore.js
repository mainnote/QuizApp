import { createStore } from './createStore';
import { findChapters } from './util';
import { LOG } from '../config';

const initialState = {
    quizzes: [],
    chapters: [],
    questions: [],
    current_index: {
        quizzes: -1,
        chapters: -1,
        questions: -1,
    },
    current_result: null,
};

const ACTION_TYPE = {
    ADD: 'ADD',
    ADD_ALL: 'ADD_ALL',
    UPDATE_INIT_INDICE: 'UPDATE_INIT_INDICE',
    UPDATE_CURRENT_INDEX: 'UPDATE_CURRENT_INDEX',
    SET_IS_COMPLETED: 'SET_IS_COMPLETED',
    RESET: 'RESET',
};

const Reducer = ( state, action ) => {
    LOG( 'Reducer: quizzes, action: ', action );

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
            // set the first chapter
            let chapters = findChapters( newState, action.quizId );
            newState.current_index.quizzes = action.quizId;
            if ( chapters.length > 0 )
                newState.current_index.chapters = chapters[ 0 ].id;

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
        case ACTION_TYPE.SET_IS_COMPLETED:
            return {
                ...state,
                current_result: action.value,
            };
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
