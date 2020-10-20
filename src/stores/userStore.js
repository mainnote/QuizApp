import { createStore } from './createStore';
import { LOG } from '../config';

const initialState = {
    jwt: null,
    user: null,
    show: false,
    isSignup: false,
};

const ACTION_TYPE = {
    UPDATE: 'UPDATE',
    RESET: 'RESET',
};

const Reducer = ( state, action ) => {
    switch ( action.type ) {
        case ACTION_TYPE.UPDATE:
            // add each key
            let all_values = {};
            action.keys.forEach( ( key, index ) => {
                all_values[ key ] = action.data[ index ];
            } );

            return {
                ...state,
                ...all_values,
            };
        case ACTION_TYPE.RESET:
            return {
                jwt: null,
                user: null,
                show: false,
                isSignup: false,
            };
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
