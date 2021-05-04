import React from 'react';
import './Preview.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPosition } from '../actions/positionActions';
import BuyButton from './BuyButton';

require('dotenv').config();

const Preview = props => {
    const dispatch = useDispatch()
    const accountStatus = useSelector(state => state.accountStatus);
    const { currentAccount } = accountStatus;
    const { token, tokenID } = props;
    
    return (
        <div className="gif-wrapper">
            <img 
                className="img-preview" 
                src={`https://ipfs.io/ipfs/${token.image}`} 
                alt={token.name} 
                onClick={() => { 
                    dispatch(setPosition({...token, tokenID}));
                    window.scrollTo(0,0);
                }}
            />
            <h1 className= "game-name">{token.name}</h1>
            <BuyButton 
                account={currentAccount}
                price={token.price}
                tokenID={tokenID}
            >
            </BuyButton>
        </div>
    );
};

export default Preview;