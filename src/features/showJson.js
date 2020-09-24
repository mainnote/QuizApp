import React from 'react';

export default React.memo( ( { data } ) => (
    <div>
        <hr />
        <h4>DEBUG DATA:</h4>
        <pre>{ JSON.stringify( data, null, 2 ) }</pre>
    </div>
) );