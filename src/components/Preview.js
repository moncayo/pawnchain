import React, { useState } from 'react';

// props should include .gif and .pgn information
const Preview = props => {
    const [qty, setQty] = useState(1);
    
    const buyToken = (qty) => {
        
    }
    //TODO: add quantity button
    return (
        <div>
            <img src={props.gif} alt={'GFYS'}/>
            <h1>{props.header}</h1>
            <h1>{props.price}</h1>
            <button onClick={buyToken(qty)}>BUY</button>
        </div>       
    );
};

export default Preview;