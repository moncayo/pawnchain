import React from 'react';

const { ethers } = require('ethers');
const pawnchainAbi = require('../abi/Pawnchain.json').abi

const BuyButton = props => {

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
        .catch(e => console.log(e));
    }

    return (
        <button onClick={buyToken}/>
    );
}

export default BuyButton;