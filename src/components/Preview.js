import React from 'react';
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
    const { token, tokenID } = props;

    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: currentAccount,
                    to: process.env.REACT_APP_CONTRACT_ADDRESS,
                    value: ethers.utils.parseEther(token.price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [tokenID])
                }
            ]
        })
        .catch(e => console.log(e));
    }
    
    return (
        <div className="gif-wrapper">
            <a href={'#top'}><img 
                className="img-preview" 
                src={`https://ipfs.io/ipfs/${token.image}`} 
                alt={token.name} 
                onClick={() => dispatch(setPosition(token.pgn))}
            /></a>
            <h1 className= "game-name">{token.name}</h1>
            <button className="gif-bid-button" onClick={buyToken}><div className="gif-bid-button--after"/>Buy for {token.price}</button>
        </div>
    );
};

export default Preview;