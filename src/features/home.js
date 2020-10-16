import React, { useContext, useEffect } from 'react';
import { DEBUG, LOG, API_ALL_QUIZZES, API_ALL_POSTS } from '../config';
import ShowJSON from './showJson';
import { requestGetWithDispatch } from '../stores/request';
import { Context as QuizContext, ACTION_TYPE as ACTION_TYPE_QUIZ, } from '../stores/quizStore';
import { Context as PostContext, ACTION_TYPE as ACTION_TYPE_POST, } from '../stores/postStore';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const API_MANAGER = {
    quizzes: false,
    posts: false,
};

export default function ( props ) {
    const { t } = useTranslation();
    const [ stateQuiz, dispatchQuiz ] = useContext( QuizContext );
    const [ statePost, dispatchPost ] = useContext( PostContext );

    // published post
    let posts = statePost.posts.filter(post => post.published);

    // first load must dispatch together
    useEffect( () => {
        LOG( 'Calling useEffect...' );

        if ( stateQuiz.quizzes.length === 0 && !API_MANAGER.quizzes ) {
            LOG( 'Requesting Quizzes' );
            API_MANAGER.quizzes = true;
            requestGetWithDispatch( dispatchQuiz, API_ALL_QUIZZES, ACTION_TYPE_QUIZ.ADD, 'quizzes' );
        }

        if ( posts.length === 0 && !API_MANAGER.posts ) {
            LOG( 'Requesting Posts' );
            API_MANAGER.posts = true;
            requestGetWithDispatch( dispatchPost, API_ALL_POSTS + '?published=true', ACTION_TYPE_POST.ADD, 'posts' );
        }
    }, [] );


    return (
        <div className="container overflow-hidden p-4">
            <h3>{ t( 'new_quiz' ) }</h3>
            { stateQuiz.quizzes.length > 0 && stateQuiz.quizzes.map( quiz => (
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
            { posts.length > 0 &&
                <React.Fragment>
                    <hr />
                    <h3>{ t( 'new_post' ) }</h3>
                    { posts.length > 0 && posts.map( post => (
                        <Link className="card btn" style={ { width: '18rem' } } key={ post.id } to={ `/content/${ post.id }` }>
                            { post.image && post.image.url &&
                                <img className="card-img-top img-thumbnail" src={ post.image.formats.small.url } alt={ post.title } />
                            }
                            <div className="card-body">
                                <h5 className="card-title">{ post.title }</h5>
                            </div>
                        </Link>
                    ) )

                    }
                </React.Fragment>
            }
            { false && <ShowJSON data={ statePost.posts } /> }
        </div>
    );
};