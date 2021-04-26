import React from 'react';

require('dotenv').config();

const { ethers } = require('ethers');

const pawnchainAbi = require('../pages/Pawnchain.json').abi

const Preview = props => {
    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: props.account,
                    to: process.env.REACT_APP_CONTRACT_ADDRESS,
                    value: ethers.utils.parseEther(props.price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [props.tokenID])
                }
            ]
        })
        .then(res => console.log(res))
        .catch(e => console.log(e));
    }

    return (
        <div>
            <li>
                <img src={props.gif} alt={props.header} />
                <h1>{props.header}</h1>
                <h1>{props.price}</h1>
                <button onClick={buyToken}>BUY</button>
            </li>
        </div>
    );
};

export default Preview;