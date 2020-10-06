import React, { useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import 'react-vis/dist/style.css';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalBarSeries,
} from 'react-vis';
import { LOG, } from '../config';
import { useTranslation } from 'react-i18next';
import { Context as QuizContext, } from '../stores/quizStore';
import { loadQuizFull } from '../stores/util';

export default function ( props ) {
    const { t } = useTranslation();
    const [ state, dispatch ] = useContext( QuizContext );

    let { quiz_id } = useParams(); // post_id will be first priority than contentKey
    LOG( 'quiz_id: ', quiz_id );
    
    // load related data for this quiz
    useEffect( () => {
        loadQuizFull( state, dispatch, quiz_id );
    }, [ quiz_id ] );

    return (
        <div className="container">
            <div>
                <XYPlot width={ 600 } height={ 300 } yType="ordinal" xDomain={ [ 0, 100 ] }>
                    <VerticalGridLines />
                    <XAxis />
                    <YAxis />
                    <HorizontalBarSeries data={ [ { y: "Q1", x: 10 }, { y: "Q2", x: 5 }, { y: "Q3", x: 15 }
                        , { y: "Q4", x: 10 }, { y: "Q5", x: 5 }, { y: "Q6", x: 15 } ] } />
                </XYPlot>
            </div>
        </div>
    );
}