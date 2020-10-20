import React, { useContext, useEffect } from 'react';
import { requestGetWithDispatch } from '../stores/request';
import { LOG, API_ALL_POSTS } from '../config';
import { useParams, useLocation } from "react-router-dom";
import { Context as PostContext, ACTION_TYPE as ACTION_TYPE_POST, } from '../stores/postStore';

export default function ( props ) {
    const [ statePost, dispatchPost ] = useContext( PostContext );

    // find post id or search string
    let { post_id } = useParams();
    let searchString;

    if ( !post_id ) {
        // search query
        let location = useLocation();
        if ( location.search ) {
            let query = new URLSearchParams( location.search );
            let post = statePost.posts.find( post => post.title === query.get( 'title' ) ); // cache
            if ( post ) post_id = post.id;
        }
        searchString = location.search;
    }

    // lookup cache
    let post = statePost.posts.find( post => post.id === post_id );
    let found = post ? true : false;

    // load post
    useEffect( () => {
        if ( !found )
            requestGetWithDispatch( dispatchPost, API_ALL_POSTS + ( post_id || searchString ), ACTION_TYPE_POST.ADD, 'posts' );
    }, [ post_id, found, searchString ] );

    return (
        <div className="container overflow-hidden p-4">
            <h1 className="text-center mb-4">{ post ? post.title : '' }</h1>
            { post && post.image && post.image.url &&
                <img className="p-4 img-fluid mx-auto d-block" src={ post.image.formats.small.url } alt={ post.title } />
            }
            <div dangerouslySetInnerHTML={ { __html: post ? post.content : '' } } />
        </div>
    );
};