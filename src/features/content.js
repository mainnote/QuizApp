import React from 'react';

export default function ( props ) {
    const html_string = '<div>Show the raw html content like privacy, terms of use etc.</div>';
    return (
        <div dangerouslySetInnerHTML={ { __html: html_string } } />
    );
};