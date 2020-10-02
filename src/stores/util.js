const stateToSurveyJS = state => {
    let quiz_id = state.current_index.quizzes;
    if ( quiz_id === -1 ) {
        return {};
    } else {
        let quiz = state.quizzes.find( z => z.id = quiz_id );

        let survey_json = {
            "title": quiz.title,
            "showProgressBar": "bottom",
            "showTimerPanel": "top",
            "firstPageIsStarted": true,
            "startSurveyText": "测试开始",
            "pages": [],
            "completedHtml": "完成了呀"
        };

        let chapters = state.chapters.filter( c => c.quiz.id === quiz_id );
        chapters.forEach( c => {
            survey_json.pages.push( {
                "elements": [
                    {
                        "type": "html",
                        "html": c.title + '<br />' + c.duration + '<br />' + c.reminds + '<br />' + c.description
                    }
                ]
            } );

            let questions = state.questions.filter( q => q.chapter.id === c.id );
            questions.forEach( q => {
                let choices = [];
                let correctAnswer = [];

                q.choice.forEach( i => {
                    choices.push({"value": i.choice_symbol, "text": i.choice_content});
                    if (i.is_answer) correctAnswer.push(i.choice_symbol);
                } );
                
                survey_json.pages.push( {
                    "elements": [
                        {
                            "type": "checkbox",
                            "title": q.question_content,
                            "choices": choices,
                            "correctAnswer": correctAnswer
                        }
                    ]
                } );
            } );
        } );

        console.log(survey_json)
        return survey_json;
    }
};

export {
    stateToSurveyJS,
};