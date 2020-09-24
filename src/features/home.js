import React, { useContext, useEffect } from 'react';
import { DEBUG, API_ALL_QUIZZES } from '../config';
import ShowJSON from './showJson';
import { requestGetWithDispatch } from '../stores/request';
import { Context as QuizContext, ACTION_TYPE, } from '../stores/quizStore';

export default function ( props ) {
    const [ state, dispatch ] = useContext( QuizContext );

    useEffect( () => {
        if ( state.quizzes.length === 0 )
            requestGetWithDispatch( dispatch, API_ALL_QUIZZES, ACTION_TYPE.ADD, 'quizzes' );
    });

    return (
        <div>
            <h1>Home page</h1>

            { DEBUG && <ShowJSON data={ state.quizzes } /> }
        </div>
    );
};