import React from "react";
import 'react-vis/dist/style.css';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalBarSeries,
} from 'react-vis';

export default function ( props ) {
    return (
        <div className="container">
            <div>
                <XYPlot width={ 600 } height={ 300 } yType="ordinal" xDomain={ [ 0, 100 ] }>
                    <VerticalGridLines />
                    <XAxis />
                    <YAxis />
                    <HorizontalBarSeries data={ [ { y: "Q1", x: 10 }, { y: "Q2", x: 5 }, { y: "Q3", x: 15 }
                     ,{ y: "Q4", x: 10 }, { y: "Q5", x: 5 }, { y: "Q6", x: 15 }] } />
                </XYPlot>
            </div>
        </div>
    );
}