import React, { useState, useEffect } from 'react'; 
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const { ethers } = require('ethers');
const ethereum = window.ethereum;

//const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const pawnchainJsonFile = require('./Pawnchain.json')
const pawnchainAbi = pawnchainJsonFile.abi;
const pawnchainContract = new ethers.Contract("0x4FAf50fEE7809d61Eeb0b7B4C551634EeF4D55Af", pawnchainAbi, provider);
const pawnchainWithSigner = pawnchainContract.connect(signer);

const MainPage = () => {    
    const [JSONdata, setJSONdata] = useState([]);
    const [prices, setPrices] = useState([]);
    const [address, setAddress] = useState('');

    const connectWallet = async () => {
        ethereum.request({ method: 'eth_requestAccounts' })
                .then(wallet => setAddress(wallet[0]));
    }

    ethereum.on('accountsChanged', function (accounts) {
        setAddress(accounts[0]);
    });
    
    useEffect(() => {
        async function fetchContractData() {
            const tokenCount = await pawnchainWithSigner
                                        ._tokenCounter()
                                        .then(count => { return count.toNumber() })
                                        .catch(e => console.log(e));

            for (let i = 1; i <= tokenCount; ++i) {
                pawnchainWithSigner
                    .tokenURI(i)
                    .then(res => {
                        ipfs.cat(res)
                            .then(res => {
                                const contents = JSON.parse(res.toString());
                                JSONdata.push(contents);
                                setJSONdata(JSONdata => [...JSONdata, contents]);
                            })
                            .catch(e => console.log(e));
                    });

                pawnchainWithSigner
                    ._prices(i)
                    .then(res => {
                        const price = ethers.utils.formatUnits(res.toString(), "ether");
                        prices.push(price);
                        setPrices(prices => [...prices, price])
                    })
            }
        }
        fetchContractData();

        pawnchainWithSigner.ownerOf(1).then(res => console.log(res));
    }, [address]);

    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
            <ChessboardWrapper 
                // TODO: replace with generic // replace with pgn string
                // TODO: call ipfs-http-client from top level
                // TODO: should be pgn string instead of CID
                CID={'QmTY2QUjwuHhGmSkShVzydCN8yyitYNGhLmA57VwAxD4bz'}
            />
            {JSONdata.length > 0 && 
            <Preview 
                gif={`https://ipfs.io/ipfs/${JSONdata[0].image}`}
                header={JSONdata[0].name}
                price={prices[0]}
                account={address}
            />}
        </div>
    );
};

export default MainPage;