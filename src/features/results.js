import React, { useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import 'react-vis/dist/style.css';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalBarSeries,
    makeWidthFlexible,
} from 'react-vis';
import { useTranslation } from 'react-i18next';
import { Context as QuizContext, } from '../stores/quizStore';
import { Context as WebsiteContext } from '../stores/websiteStore';
import { loadQuizFull, getCurrentResultSummary, loadResult } from '../stores/util';
import Mark from './marks';
import { getPoints, getSeries } from '../stores/util';

const Plot = makeWidthFlexible( XYPlot );

export default function ( props ) {
    const { t } = useTranslation();
    const [ stateQuiz, dispatchQuiz ] = useContext( QuizContext );
    const [ stateWebsite, dispatchWebsite ] = useContext( WebsiteContext );

    let { quiz_id } = useParams(); // post_id will be first priority than contentKey

    // load related data for this quiz
    useEffect( () => {
        if ( quiz_id )
            loadQuizFull( stateQuiz, dispatchQuiz, quiz_id );
        else
            loadResult( dispatchWebsite );
    }, [ quiz_id ] );

    let marks = quiz_id ? getCurrentResultSummary( stateQuiz ) : stateWebsite.statistics && stateWebsite.statistics.value.result;

    return (
        <div className="container overflow-hidden">
            { marks &&
                <div>
                    { quiz_id ?
                        <div>
                            <h4>{ t( 'old_testament_marks' ) }: { getPoints( marks.old_testament.total ) }{ t( 'points' ) }</h4>
                            <Mark data={ marks.old_testament } />
                            <h4>{ t( 'new_testament_marks' ) }: { getPoints( marks.new_testament.total ) }{ t( 'points' ) }</h4>
                            <Mark data={ marks.new_testament } />
                            <h4>{ t( 'all_testament_marks' ) }: { getPoints( marks.all_testaments.total ) }{ t( 'points' ) }</h4>
                            <Mark data={ marks.all_testaments } />
                        </div>
                        : <h4>{ t( 'total_tested_user' ) }{ stateWebsite.statistics.value.total_user_count }</h4>
                    }

                    <div>
                        <h4>{ t( 'all_categories_chart' ) }</h4>
                        <div>
                            <Plot className="m-auto" margin={ { left: 60 } } height={ 300 } yType="ordinal" xDomain={ [ 0, 100 ] }>
                                <VerticalGridLines />
                                <XAxis />
                                <YAxis />
                                <HorizontalBarSeries data={ getSeries( marks ) } />
                            </Plot>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}