import React, { useState } from 'react';

// props should include .gif and .pgn information
const Preview = props => {    
    const buyToken = () => {
        
    }

    return (
        <div>
            <img src={props.gif} alt={'GFYS'}/>
            <h1>{props.header}</h1>
            <h1>{props.price}</h1>
            <button onClick={buyToken}>BUY</button>
        </div>       
    );
};

export default Preview;