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

    const names = token.name.split(' vs. ');
    const white_name = names[0]
    const black_name = names[1];
    
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
            <div className="name-container"> 
                <h1 className= "game-name">{white_name}</h1>
                <h1 className= "game-name">vs.</h1>
                <h1 className= "game-name">{black_name}</h1>    
            </div>
            <div className="wrapper-button-preview">
                {window.ethereum
                ? <BuyButton 
                    account={currentAccount}
                    price={token.price}
                    tokenID={tokenID}
                >
                </BuyButton>
                : null
                }   
            </div>
        </div>
    );
};

export default Preview;