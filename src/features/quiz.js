import React, { useContext, useEffect } from 'react';
import * as Survey from 'survey-react';
import "survey-react/survey.css";
import { DEBUG, LOG, API_ALL_QUIZZES, API_ALL_CHAPTERS, API_ALL_QUESTIONS } from '../config';
import ShowJSON from './showJson';
import { requestGet } from '../stores/request';
import { Context as QuizContext, ACTION_TYPE, } from '../stores/quizStore';
import { useParams } from "react-router-dom";

import test_json from '../test_data/test_question1.json';


Survey
    .StylesManager
    .applyTheme( "bootstrap" );
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

export default function ( props ) {
    const [ state, dispatch ] = useContext( QuizContext );
    LOG('DEBUG: (quiz.js) Rednering quiz...');
    let { quiz_id } = useParams();
    console.log(quiz_id);

    // this is a data loading example only!!!!!!
    useEffect( () => {
        // if not load the quizzes, first chapter and the questions of the first chapter
        LOG( 'quizzes', state.quizzes )
        if ( state.quizzes.length === 0 ) {
            loadQuizzes()
                .then( res => {
                    let quizzes_data = res.data;
                    // first quiz
                    loadChapters( quiz_id || quizzes_data[ 0 ].id ).then( res => {
                        let chapters_data = res.data;
                        // first chapter
                        loadQuestions( chapters_data[ 0 ].id ).then( res => {
                            let questions_data = res.data;
                            dispatch( {
                                type: ACTION_TYPE.ADD_ALL,
                                keys: [ 'quizzes', 'chapters', 'questions' ],
                                data: [ quizzes_data, chapters_data, questions_data ]
                            } );

                        } );
                    } );
                } );
        } else {
            // if not load chapters for first quiz
            LOG( 'chapters', state.chapters )
            if ( state.chapters.length === 0 || !state.chapters.some( c => c.quiz.id === state.quizzes[ 0 ].id ) ) {
                loadChapters( quiz_id || state.quizzes[ 0 ].id ).then( res => {
                    let chapters_data = res.data;
                    // first chapter
                    loadQuestions( chapters_data[ 0 ].id ).then( res => {
                        let questions_data = res.data;
                        dispatch( {
                            type: ACTION_TYPE.ADD_ALL,
                            keys: [ 'chapters', 'questions' ],
                            data: [ chapters_data, questions_data ]
                        } );
                    } );
                } );
            } else {
                // if not load chapters for first quiz
                LOG( 'questions', state.questions );
                if ( state.questions.length === 0 || !state.questions.some( q => q.chapter.id === state.chapters[ 0 ].id ) ) {
                    // first chapter
                    loadQuestions( state.chapters[ 0 ].id ).then( res => {
                        let questions_data = res.data;
                        dispatch( { type: ACTION_TYPE.ADD, key: 'questions', questions_data } );
                    } );
                }

            }
        }

        // load functions
        function loadQuizzes() {
            return requestGet( API_ALL_QUIZZES );
        }
        function loadChapters( quizId ) {
            return requestGet( API_ALL_CHAPTERS + '?quiz=' + quizId );
        }
        function loadQuestions( chapterId ) {
            return requestGet( API_ALL_QUESTIONS + '?chapter=' + chapterId );
        }

    } );


    const model = new Survey.Model( test_json );

    const onValueChanged = ( result ) => {
        console.log( "value changed!" );
    };

    const onComplete = ( result ) => {
        console.log( "Complete! " + result );
    };

    return (
        <div className="container">
            <h2>This is our test!</h2>
            <Survey.Survey
                model={ model }
                onComplete={ onComplete }
                onValueChanged={ onValueChanged }
            />

            { DEBUG && <ShowJSON data={ state.questions } /> }
        </div>
    );
};