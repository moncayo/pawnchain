import React, { useState } from 'react';
const { ethers } = require('ethers');

//const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const pawnchainJsonFile = require('../pages/Pawnchain.json')
const pawnchainAbi = pawnchainJsonFile.abi;
const pawnchainContract = new ethers.Contract("0x4FAf50fEE7809d61Eeb0b7B4C551634EeF4D55Af", pawnchainAbi, provider);
const pawnchainWithSigner = pawnchainContract.connect(signer);

// TODO: generalize
const Preview = props => {    
    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: props.account,
                    to:"0x4FAf50fEE7809d61Eeb0b7B4C551634EeF4D55Af",
                    value: ethers.utils.parseEther(props.price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [1])
                }
            ]
        })
        .then(res => console.log(res))
        .catch(e => console.log(e));

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