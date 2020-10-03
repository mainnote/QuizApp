import React, { useContext, useEffect } from 'react';
import * as Survey from 'survey-react';
import "survey-react/survey.css";
import { DEBUG, LOG, API_ALL_QUIZZES, API_ALL_CHAPTERS, API_ALL_QUESTIONS } from '../config';
import ShowJSON from './showJson';
import { requestGet } from '../stores/request';
import { Context as QuizContext, ACTION_TYPE, } from '../stores/quizStore';
import { useParams } from "react-router-dom";
import { stateToSurveyJS } from '../stores/util';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

// import test_json from '../test_data/test_question2.json';


Survey.StylesManager.applyTheme( "darkblue" );
// Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

export default function ( props ) {
    const [ state, dispatch ] = useContext( QuizContext );
    LOG( 'DEBUG: (quiz.js) Rednering quiz...' );
    let { quiz_id } = useParams();
    console.log( quiz_id );

    // this is a data loading example only!!!!!!
    useEffect( () => {
        // if not load the quizzes, first chapter and the questions of the first chapter
        if ( quiz_id ) {
            // load functions
            // all quizzes
            function loadQuizzes() {
                if ( state.quizzes.length === 0 ) {
                    return requestGet( API_ALL_QUIZZES + '?_limit=-1' );
                } else {
                    return Promise.resolve( { data: [] } );
                }
            }
            // all chapters for this quiz
            function loadChapters( quizId ) {
                if ( state.chapters.length === 0 ||
                    !state.chapters.some( c => c.quiz.id === quiz_id ) ) {
                    return requestGet( API_ALL_CHAPTERS + '?quiz=' + quizId + '&_limit=-1&_sort=chapter_no:ASC' );
                } else {
                    return Promise.resolve( { data: [] } );
                }

            }
            // all questions for this quiz
            function loadQuestions( quizId ) {
                if ( state.questions.length === 0
                    || !state.questions.some( q => q.chapter.quiz === quiz_id ) ) {
                    return requestGet( API_ALL_QUESTIONS + '?chapter.quiz=' + quizId + '&_limit=-1&_sort=question_no:ASC' );
                } else {
                    return Promise.resolve( { data: [] } );
                }
            }

            // process
            loadQuizzes().then( res0 => {
                LOG( 'quizzes:', res0.data )
                return loadChapters( quiz_id ).then( res1 => {
                    LOG( 'chapters:', res1.data )
                    return loadQuestions( quiz_id ).then( res2 => {
                        LOG( 'questions:', res2.data )
                        dispatch( {
                            type: ACTION_TYPE.ADD_ALL,
                            quizId: quiz_id,
                            keys: [ 'quizzes', 'chapters', 'questions' ],
                            data: [ res0.data, res1.data, res2.data ],
                        } );
                    } );
                } );
            } );
        }
    }, [ quiz_id ] );

    const [ survey_json, nextChapter ] = stateToSurveyJS( state );
    let content;

    if ( isEmpty( survey_json ) ) {
        content = (
            <Loader
                className="loader"
                type="Hearts"
                color="pink"
                height={ 100 }
                width={ 100 }
            />
        );
    } else {
        const model = new Survey.Model( survey_json );
        model.locale = 'zh-cn';
        model.onTextMarkdown.add( function ( survey, options ) {
            options.html = options.text;
        } );
        // model.showPreviewBeforeComplete = 'showAnsweredQuestions';

        // this chapter is completed
        if ( state.current_result ) {
            model.mode = 'display';
            LOG( "Result:", state.current_result );
            model.data = state.current_result;
            model.onAfterRenderQuestion
                .add( function ( survey, options ) {
                    var span = document.createElement( "span" );
                    var isCorrect = options.question.isAnswerCorrect();
                    span.innerHTML = isCorrect ? "Correct" : "Incorrect";
                    span.style.color = isCorrect ? "green" : "red";
                    var header = options
                        .htmlElement
                        .querySelector( "h5" );
                    if ( !isCorrect ) {
                        header.style.backgroundColor = "salmon";
                        var answers = options.question.correctAnswer;
                        if ( options.question.getType() === "radiogroup" ) {
                            answers = [ answers ];
                        }
                        for ( var i = 0; i < answers.length; i++ ) {
                            var item = options
                                .htmlElement.querySelector( 'input[value="' + answers[ i ] + '"]' );
                            if ( !!item ) {
                                item.parentElement.style.color = "green";
                            }
                        }
                    }
                    header.appendChild( span );
                } );


            content = (
                <Survey.Survey
                    model={ model }
                />
            );
        } else {
            const onValueChanged = ( result ) => {
                console.log( "value changed!" );
            };

            const onComplete = ( result ) => {
                console.log( result.data );
                dispatch( {
                    type: ACTION_TYPE.SET_IS_COMPLETED,
                    value: result.data,
                } );
            };
            content = (
                <Survey.Survey
                    model={ model }
                    onComplete={ onComplete }
                    onValueChanged={ onValueChanged }
                />
            );
        }
    }
    return (
        <div className="container">
            { content }
            { DEBUG && <ShowJSON data={ state.questions } /> }
        </div>
    );
};