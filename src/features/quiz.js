import React, { useContext, useEffect, useState } from 'react';
import * as Survey from 'survey-react';
import "survey-react/survey.css";
import { DEBUG, LOG } from '../config';
import ShowJSON from './showJson';
import { Context as QuizContext, ACTION_TYPE, } from '../stores/quizStore';
import { useParams } from "react-router-dom";
import { stateToSurveyJS, loadQuizFull } from '../stores/util';
import { isEmpty, template } from 'lodash';
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

Survey.StylesManager.applyTheme( "darkblue" );

export default function ( props ) {
    const [ showWrong, setShowWrong ] = useState( false );
    const { t } = useTranslation();
    const [ state, dispatch ] = useContext( QuizContext );
    LOG( 'DEBUG: (quiz.js) Rednering quiz...' );
    let { quiz_id } = useParams();
    console.log( quiz_id );

    // load related data for this quiz
    useEffect( () => {
        loadQuizFull( state, dispatch, quiz_id );
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
        console.log(model)
        console.log(state)
        model.locale = 'zh-cn';
        model.onTextMarkdown.add( function ( survey, options ) {
            options.html = options.text;
        } );

        // this chapter is completed
        if ( state.current_result ) {
            model.mode = 'display';
            LOG( "Result:", state.current_result );
            model.data = state.current_result;
            model.questionsOnPageMode = "singlePage";
            model.onAfterRenderQuestion
                .add( function ( survey, options ) {
                    LOG( 'After rendering question....' );
                    var span = document.createElement( "span" );
                    var isCorrect = options.question.isAnswerCorrect();
                    span.innerHTML = isCorrect ? ` (${ t( 'right' ) })` : ` (${ t( 'wrong' ) })`;
                    span.style.color = isCorrect ? "green" : "white";
                    var header = options
                        .htmlElement
                        .querySelector( "h5" );
                    // for incorrect answer, hightlight question
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
                                item.parentElement.style.padding = '4px'
                                item.parentElement.style.border = 'thick solid green';
                            }
                        }
                    } else {
                        if ( showWrong )
                            options.htmlElement.style.display = 'none';
                    }
                    header.appendChild( span );
                } );

            let compiled = template( t( 'result_text' ) );
            let result_text = compiled( {
                total: model.getQuizQuestionCount(),
                corrected: model.getCorrectedAnswerCount()
            } );

            content = (
                <React.Fragment>
                    <div className="row">
                        <div className="col pt-4 text-center text-success h5">
                            { result_text }
                        </div>
                    </div>
                    <div className="row pt-4">
                        <div className="col-md text-center m-2">
                            { nextChapter ? (
                                <button className="btn btn-success" onClick={ () => {
                                    dispatch( {
                                        type: ACTION_TYPE.SET_NEXT_CHAPTER,
                                        nextChapter: nextChapter,
                                    } );
                                } }>{ t( 'next_chapter' ) }</button>
                            ) : (
                                    <Link className="btn btn-success" to={ `/results/${ quiz_id }` }>{ t( 'check_result' ) }</Link>
                                )
                            }
                        </div>
                        <div className="col-md text-center m-2">
                            <button className="btn btn-outline-secondary" onClick={ () => {
                                dispatch( {
                                    type: ACTION_TYPE.SET_CURRENT_RESULT,
                                    value: null,
                                } );

                            } }>{ t( 'redo' ) }</button>
                        </div>
                        <div className="col-md text-center m-2">
                            <label className="switch">
                                <input type="checkbox" onChange={ () => { setShowWrong( !showWrong ) } } />
                                <span className="slider round"></span>
                            </label>
                            <span className="ml-2 text-secondary">{ t( 'wrong_answers' ) }</span>
                        </div>
                        

                    </div>
                    <Survey.Survey
                        key={ Math.random() }
                        model={ model }
                    />
                </React.Fragment>
            );
        } else {
            const onValueChanged = ( result ) => {
                console.log( "value changed!" );
            };

            const onComplete = ( result, isCorrect ) => {
                if (isCorrect){
                    dispatch( {
                    type: ACTION_TYPE.SET_CURRENT_RESULT,
                    value: result.data,
                })
                
                }else{
                    dispatch({
                        type: ACTION_TYPE.SET_CURRENT_RESULT,
                        value: result.data,
                    })
                }
                console.log('here is the state', state)
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
            { false && <ShowJSON data={ state.questions } /> }
        </div>
    );
};