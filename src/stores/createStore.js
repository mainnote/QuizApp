import React, { createContext, useReducer } from 'react';

const createStore = ( Reducer, initialState ) => {
    const Context = createContext( initialState );

    const Store = ( { children } ) => {
        const [ state, dispatch ] = useReducer( Reducer, initialState );
        return (
            <Context.Provider value={ [ state, dispatch ] }>
                { children }
            </Context.Provider>
        );
    };

    return { Context, Store };
};

export { createStore };