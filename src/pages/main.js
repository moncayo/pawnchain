import React, { useEffect } from 'react'; 
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const MainPage = () => {    

    useEffect(() => {
        async function startIPFS() {
            
        }

        startIPFS();

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