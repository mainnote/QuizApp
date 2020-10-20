
import { createStore } from './createStore';
import { LOG } from '../config';

const initialState = {
    website: null,
};

const ACTION_TYPE = {
    ADD: 'ADD',
};

const Reducer = ( state, action ) => {
    switch ( action.type ) {
        case ACTION_TYPE.ADD:
            return {
                ...state,
                [ action.key ]: action.data,
            };
        default:
            return state;
    }
};

const { Store, Context } = createStore( Reducer, initialState );

export {
    ACTION_TYPE, Store, Context,
};
