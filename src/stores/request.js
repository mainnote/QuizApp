import axios from 'axios';

// remote with API
const requestGet = ( url ) => {
    return axios.get( url );
};

const requestGetWithDispatch = ( dispatch, url, type, key ) => {
    return requestGet( url ).then( ( { data } ) => {
        if ( data.length > 0 )
            dispatch( { type: type, key: key, data } );
    } );
}

const requestPost = (url, data) => {
    return axios.post(url, data);
}

export {
    requestGet, requestGetWithDispatch, requestPost,
}