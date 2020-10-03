import { template } from 'lodash';
import { DEBUG, LOG } from '../config';

const chapterHtml = template( '<h5><%= title %></h5><p><%= duration %></p><p><%= reminds %></p><div class="h6"><%= description %></div>' );
const findChapters = ( state, quiz_id ) => {
    return state.chapters.filter( c => c.quiz.id === quiz_id ).sort( ( a, b ) => a.chapter_no - b.chapter_no );
};

const findNextChapter = ( state, quiz_id ) => {
    let chapter_id = state.current_index.chapters;

    let chapters = findChapters( state, quiz_id );
    let isNext = false;
    chapters.forEach( c => {
        if ( c.id === chapter_id ) {
            isNext = true;
        }

        if ( isNext ) {
            return c;
        }
    } );

    return null;
};


const stateToSurveyJS = state => {
    let quiz_id = state.current_index.quizzes;
    let chapter_id = state.current_index.chapters;
    if ( quiz_id === -1 ) {
        return [ {}, null ];
    } else {
        let current_result = state.current_result;
        let isResult = current_result ? true : false;
        let quiz = state.quizzes.find( z => z.id = quiz_id );

        let survey_json = {
            "showTitle": !isResult,
            "title": quiz.title,
            "showProgressBar": isResult ? "off" : "bottom",
            "showTimerPanel": isResult ? "none" : "top",
            "firstPageIsStarted": isResult ? false : true,
            "startSurveyText": "测试开始",
            "pages": [],
            "showCompletedPage": false,
            "showQuestionNumbers": "off",
        };

        let chapters = findChapters( state, quiz_id );
        let isNext = false;
        let nextChapter = null;
        chapters.forEach( c => {
            if ( c.id === chapter_id ) {
                if ( !isResult ) {
                    survey_json.pages.push( {
                        "elements": [
                            {
                                "type": "html",
                                "html": chapterHtml( { title: c.title, duration: c.duration, reminds: c.reminds, description: c.description } ),
                            }
                        ]
                    } );
                }

                let questions = state.questions.filter( q => q.chapter.id === c.id ).sort( ( a, b ) => a.question_no - b.question_no );
                if ( DEBUG ) questions = questions.slice( 0, 1 );

                questions.forEach( q => {
                    let choices = [];
                    let correctAnswer = [];

                    q.choice.forEach( i => {
                        choices.push( { "value": i.choice_symbol, "text": i.choice_symbol + '. ' + i.choice_content } );
                        if ( i.is_answer ) correctAnswer.push( i.choice_symbol );
                    } );

                    survey_json.pages.push( {
                        "elements": [
                            {
                                "type": "checkbox",
                                "name": q.question_no.toString(),
                                "title": q.question_no + '. ' + q.question_content,
                                "choices": choices,
                                "correctAnswer": correctAnswer,
                            }
                        ]
                    } );
                } );

                // set for next chapter
                isNext = true;
            }

            if ( isNext ) {
                isNext = false;
                nextChapter = c.id;
            }
        } );

        LOG( "json:", survey_json );
        LOG( "isNext:", nextChapter );
        return [ survey_json, nextChapter ];
    }
};

export {
    stateToSurveyJS, findChapters, findNextChapter
};