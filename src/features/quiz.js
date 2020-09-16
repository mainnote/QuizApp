import React from 'react';
import * as Survey from 'survey-react';
import "survey-react/survey.css";
import test_json from '../test_data/test_question1.json';

Survey
    .StylesManager
    .applyTheme( "bootstrap" );
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

export default function () { 
    const model = new Survey.Model(test_json);

    const onValueChanged = (result) => {
        console.log("value changed!");
    };
    
    const onComplete = (result) => {
        console.log("Complete! " + result);
    };

    return (
    <div className="container">
        <h2>This is our test!</h2>
        <Survey.Survey
            model={model}
            onComplete={onComplete}
            onValueChanged={onValueChanged}
          />
    </div>
    );
};