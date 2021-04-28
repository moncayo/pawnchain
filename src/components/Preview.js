import React, { useEffect, useState } from 'react';
import './Preview.css';

require('dotenv').config();

const { ethers } = require('ethers');

const pawnchainAbi = require('../abi/Pawnchain.json').abi

const Preview = props => {
    const [address, setAddress] = useState('');

    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(wallet => { setAddress(wallet[0]) })
            .catch(e => console.log(e));
    })

    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: address,
                    to: process.env.REACT_APP_CONTRACT_ADDRESS,
                    value: ethers.utils.parseEther(props.price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [props.tokenID])
                }
            ]
        })
        .catch(e => console.log(e));
    }

    return (
        <div className="gif-wrapper">
            <img className="img-preview" src={props.gif} alt={props.header} />
            <h1 className= "game-name">{props.header}</h1>
            <button onClick={buyToken}>Buy for {props.price}</button>

        </div>
    );
};

export default Preview;