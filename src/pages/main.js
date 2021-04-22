import React, { useEffect } from 'react'; 
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const { ethers } = require('ethers');


const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
const signer = provider.getSigner(1);
const pawnchainJsonFile = require('./Pawnchain.json')
const pawnchainAbi = pawnchainJsonFile.abi;
const pawnchainContract = new ethers.Contract("0xC69edc97581E4baA91Ff9E99aE3f790e62293aeE", pawnchainAbi, provider);
const pawnchainWithSigner = pawnchainContract.connect(signer);

const MainPage = () => {    

    useEffect(() => {
        
    }, []);

    return (
        <div>
            <ChessboardWrapper 
                // TODO: replace with generic // replace with pgn string
                // TODO: call ipfs-http-client from top level
                // TODO: should be pgn string instead of CID
                CID={'QmTY2QUjwuHhGmSkShVzydCN8yyitYNGhLmA57VwAxD4bz'}
            />
            <Preview 
                gif={"https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif"}
                header={"Test"}
                price={100}
            />
                    
        </div>
    );
};

export default MainPage;