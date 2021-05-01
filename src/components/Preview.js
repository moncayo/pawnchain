import React, { useEffect, useState } from 'react';
import './Preview.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPosition } from '../actions/positionActions';

require('dotenv').config();

const { ethers } = require('ethers');

const pawnchainAbi = require('../abi/Pawnchain.json').abi

const Preview = props => {
    const dispatch = useDispatch()
    const accountStatus = useSelector(state => state.accountStatus);
    const { currentAccount } = accountStatus;
    const { token } = props;

    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: currentAccount,
                    to: process.env.REACT_APP_CONTRACT_ADDRESS,
                    value: ethers.utils.parseEther(token.price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [token.tokenID])
                }
            ]
        })
        .catch(e => console.log(e));
    }
    
    return (
        <div className="gif-wrapper">
            <img 
                className="img-preview" 
                src={`https://ipfs.io/ipfs/${token.image}`} 
                alt={token.name} 
                onClick={() => dispatch(setPosition(token.pgn))}
            />
            <h1 className= "game-name">{token.name}</h1>
            <button onClick={buyToken}>Buy for {token.price}</button>
        </div>
    );
};

export default Preview;