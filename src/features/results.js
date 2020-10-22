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
import { loadQuizFull, getCurrentResultSummary } from '../stores/util';
import Mark from './marks';
import { getPoints, getSeries } from '../stores/util';


export default function ( props ) {
    const { t } = useTranslation();
    const [ stateQuiz, dispatchQuiz ] = useContext( QuizContext );

    let { quiz_id } = useParams(); // post_id will be first priority than contentKey

    // load related data for this quiz
    useEffect( () => {
        loadQuizFull( stateQuiz, dispatchQuiz, quiz_id );
    }, [ quiz_id ] );

    let marks = getCurrentResultSummary( stateQuiz );
    console.log( marks )

    return (
        <div className="container overflow-hidden">
            <div>
                <div>
                    <h4>{ t( 'old_testament_marks' ) }: { getPoints( marks.old_testament.total ) }{ t( 'points' ) }</h4>
                    <Mark data={ marks.old_testament } />
                    <h4>{ t( 'new_testament_marks' ) }: { getPoints( marks.new_testament.total ) }{ t( 'points' ) }</h4>
                    <Mark data={ marks.new_testament } />
                    <h4>{ t( 'all_testament_marks' ) }: { getPoints( marks.all_testaments.total ) }{ t( 'points' ) }</h4>
                    <Mark data={ marks.all_testaments } />
                </div>

                <div>
                    <h4>{ t( 'all_categories_chart' ) }</h4>
                    <XYPlot width={ 300 } height={ 300 } yType="ordinal" xDomain={ [ 0, 100 ] }>
                        <VerticalGridLines />
                        <XAxis />
                        <YAxis />
                        <HorizontalBarSeries data={ getSeries( marks ) } />
                    </XYPlot>
                </div>
            </div>
        </div>
    );
}