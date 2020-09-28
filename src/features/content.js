import React, { useState, useEffect } from 'react';
import { requestGet } from '../stores/request';
import { LOG, BASE_API, API_ALL_POSTS } from '../config';

export default function ( props ) {
    const [ content, setContent ] = useState( '' );
    let { contentKey, isPost } = props;

    useEffect( () => {
        let url;
        if ( isPost ) {
            url = API_ALL_POSTS + contentKey;
        } else {
            url = BASE_API + contentKey;
        }
        requestGet( url ).then( res => setContent( res.data.content ) );
    } );

    LOG( 'Rendering content page.' );

    return (
        <div dangerouslySetInnerHTML={ { __html: content } } />
    );
};