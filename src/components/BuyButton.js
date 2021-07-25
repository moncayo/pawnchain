import React from 'react';
import { useSelector } from 'react-redux';

const { ethers } = require('ethers');
const pawnchainAbi = require('../abi/Pawnchain.json').abi

const BuyButton = props => {
    const { account, price, tokenID } = props;
    const accountStatus = useSelector(state => state.accountStatus);
    const { currentAccount } = accountStatus;
    
    const buyToken = () => {
        if (window.ethereum && currentAccount) {
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
        } else {
            alert("Connect your MetaMask wallet to buy!");
        }
    }

    return (
        <div>
         <button className="gif-bid-button" onClick={buyToken}> <div className="gif-bid-button--after"/>Ξ {price}</button>
        </div>
    );
}

export default BuyButton;
