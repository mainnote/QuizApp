import axios from 'axios';

// remote with API
const requestGet = ( url, config ) => {
    return axios.get( url, config || {} );
};

const requestGetWithDispatch = ( dispatch, url, type, key ) => {
    return requestGet( url ).then( ( { data } ) => {
        if ( data )
            dispatch( { type: type, key: key, data } );
    } );
}

const requestPost = ( url, data, config ) => {
    return axios.post( url, data, config || {} );
}

export {
    requestGet, requestGetWithDispatch, requestPost,
}