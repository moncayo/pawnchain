import React, { useEffect, useState } from 'react';
import tokenAvailability from '../tokenAvailability';

const { ethers } = require('ethers');
const pawnchainAbi = require('../abi/Pawnchain.json').abi

const BuyButton = props => {
    const { account, price, tokenID } = props;
    const [available, setAvailability] = useState(false)

    useEffect(() => {
        if (window.ethereum) {
            tokenAvailability(tokenID)
            .then(res => setAvailability(res))
        }
    })

    const buyToken = () => {
        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: account,
                    to: process.env.REACT_APP_CONTRACT_ADDRESS,
                    value: ethers.utils.parseEther(price).toHexString(),
                    data: new ethers.utils.Interface(pawnchainAbi).encodeFunctionData('vendingMachine', [tokenID])
                }
            ]
        })
    }

    return (
        <div>
        {available 
        ? <button className="gif-bid-button" onClick={buyToken}> <div className="gif-bid-button--after"/>Ξ {price}</button>
        : <button className="gif-bid-button" disabled={available}>SOLD</button>
        }
        </div>
    );
}

export default BuyButton;