import { createStore } from './createStore';
import { DEBUG } from '../config';

const initialState = {
    quizzes: [],
    chapters: [],
    questions: [],
    current_index: {
        quizzes: -1,
        chapters: -1,
        questions: -1,
    },
};

const ACTION_TYPE = {
    ADD: 'ADD',
    ADD_ALL: 'ADD_ALL',
    UPDATE_CURRENT_INDEX: 'UPDATE_CURRENT_INDEX',
    RESET: 'RESET',
};

const Reducer = ( state, action ) => {
    if ( DEBUG ) console.log( 'Reducer: quizzes, action: ', action );

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

            return {
                ...state,
                ...all_values,
            }

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
                current_quiz_index: {
                    ...state.current_index,
                    [ action.key ]: -1,
                },
            };
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
