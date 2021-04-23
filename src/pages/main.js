import React, { useState, useEffect } from 'react'; 
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
const signer = provider.getSigner(1);
const pawnchainJsonFile = require('./Pawnchain.json')
const pawnchainAbi = pawnchainJsonFile.abi;
const pawnchainContract = new ethers.Contract("0x612dB8d1037519617cAAb9D47F08fd7F4273A749", pawnchainAbi, provider);
const pawnchainWithSigner = pawnchainContract.connect(signer);

const MainPage = () => {    
    const [JSONdata, setJSONdata] = useState([]);
    const [prices, setPrices] = useState([]);
    
    useEffect(() => {
        async function fetchContractData() {
            const tokenCount = await pawnchainWithSigner
                                        ._tokenCounter()
                                        .then(count => { return count.toNumber() })

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
    }, []);

    return (
        <div>
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
            />}
        </div>
    );
};

export default MainPage;