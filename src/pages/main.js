import React, { useEffect, useState } from 'react'; 
import Chessboard from 'chessboardjsx';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const Chess = require('chess.js');
const chess = new Chess();

// TODO: separate chessboard component
const MainPage = () => {    
    const [board, setBoard] = useState('')
    const [lastMoves, setLastMoves] = useState([]);

    const onClickBack = () => {
        const undo_move = chess.undo();
        if (undo_move != null) {
            setLastMoves(lastMoves => [...lastMoves, undo_move]);
            setBoard(chess.fen());
        }
    }

    const onClickForward = () => {
        const last_move = lastMoves.pop()
        if (last_move) {
            chess.move(last_move);
        }
        setBoard(chess.fen());
    }

    const onClickReset = () => {
        setLastMoves(chess.history({ verbose: true }).reverse());
        chess.reset();
        setBoard(chess.fen());
    }

    useEffect(() => {
        async function startIPFS() {
            const data = await ipfs.get('QmTY2QUjwuHhGmSkShVzydCN8yyitYNGhLmA57VwAxD4bz');
            chess.load_pgn(data[0].content.toString());
            setBoard(chess.fen());
        }

        startIPFS();
    }, []);

    return (
        <div>
            <Chessboard 
                position={board} 
            />
            <button onClick={onClickBack}>Back</button>            
            <button onClick={onClickForward}>Forward</button>    
            <button onClick={onClickReset}>Reset Board</button>        
        </div>
    );
};

export default MainPage;