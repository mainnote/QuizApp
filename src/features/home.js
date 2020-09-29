import React, { useContext, useEffect } from 'react';
import { DEBUG, API_ALL_QUIZZES } from '../config';
import ShowJSON from './showJson';
import { requestGetWithDispatch } from '../stores/request';
import { Context as QuizContext, ACTION_TYPE, } from '../stores/quizStore';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

export default function ( props ) {
    const { t } = useTranslation();
    const [ state, dispatch ] = useContext( QuizContext );

    useEffect( () => {
        if ( state.quizzes.length === 0 )
            requestGetWithDispatch( dispatch, API_ALL_QUIZZES, ACTION_TYPE.ADD, 'quizzes' );
    } );

    return (
        <div className="container">
            <h3>{t('new_quiz')}</h3>
            { state.quizzes.length > 0 && state.quizzes.map( quiz => (
                <div className="card" style={ { width: '18rem' } } key={ quiz.id }>
                    { quiz.thumbnail && quiz.thumbnail.url &&
                        <img className="card-img-top img-thumbnail" src={ quiz.thumbnail.formats.small.url } alt={ quiz.title } />
                    }
                    <div className="card-body">
                        <h5 className="card-title">{ quiz.title }</h5>
                        <Link className="btn btn-primary float-right" to={ `/quiz/${ quiz.id }` }>{ t( 'start' ) }</Link>
                    </div>
                </div>
            ) )

            }

            { DEBUG && <ShowJSON data={ state.quizzes } /> }
        </div>
    );
};