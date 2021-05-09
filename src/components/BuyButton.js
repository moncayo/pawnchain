import React, { useEffect, useState } from 'react';

const { ethers } = require('ethers');
const pawnchainAbi = require('../abi/Pawnchain.json').abi

const BuyButton = props => {
    const { account, price, tokenID } = props;
    const [available, setAvailability] = useState(false)

    useEffect(() => {
        if (window.ethereum.isConnected()) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                provider.listAccounts()
                    .then(wallet => {
                        if (wallet.length) {
                            const signer = provider.getSigner();
                            const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
                    
                            const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, signer);
            
                            pawnchainContract.ownerOf(tokenID)
                            .then(res => setAvailability(res === process.env.REACT_APP_CONTRACT_ADDRESS));    
                        }
                    })
            } catch (err) {
                console.log(err)
            }
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
        : <button className="gif-bid-button" disabled={available}>UNAVAILABLE</button>
        }
        </div>
    );
}

export default BuyButton;