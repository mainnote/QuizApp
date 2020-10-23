import { createStore } from './createStore';

const initialState = {
    posts: [],
};

const ACTION_TYPE = {
    ADD: 'ADD',
    ADD_ALL: 'ADD_ALL',
    RESET: 'RESET',
};

const Reducer = ( state, action ) => {
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
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
