import React, { useState, useEffect } from 'react';
import { requestGet } from '../stores/request';
import { LOG, BASE_API, API_ALL_POSTS } from '../config';
import { useParams } from "react-router-dom";

export default function ( props ) {
    const [ content, setContent ] = useState( '' );
    let { contentKey, isPost } = props;
    let { post_id } = useParams(); // post_id will be first priority than contentKey
    LOG( 'post_id: ', post_id );

    useEffect( () => {
        let url;
        if ( isPost ) {
            url = API_ALL_POSTS + (!post_id ? contentKey : post_id);
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