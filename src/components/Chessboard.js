import React, { useEffect, useState } from 'react'; 
import Chessboard from 'chessboardjsx';
import './Chessboard.css'
import { useSelector } from 'react-redux';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const Chess = require('chess.js');
const chess = new Chess();

const ChessboardWrapper = () => {    
    const [pgn, setPgn] = useState('')
    const [board, setBoard] = useState('')
    const [lastMoves, setLastMoves] = useState([]); // Last in First Out
    const [orientation, setOrientation] = useState('white');

    const boardSelector = useSelector(state => state.boardPosition);
    const { position } = boardSelector;

    const onClickBack = () => {
        const undo_move = chess.undo();
        if (undo_move) {
            setLastMoves(lastMoves => [...lastMoves, undo_move]);
            setBoard(chess.fen());
        }
    }

    const onClickForward = () => {
        const last_move = lastMoves.pop()
        if (last_move) {
            chess.move(last_move);
            setBoard(chess.fen());
        }
    }

    const onClickReset = () => {
        chess.load_pgn(pgn);
        setLastMoves(chess.history({ verbose: true }).reverse());
        chess.reset();
        setBoard(chess.fen());
    }

    const onClickLastMove = () => {
        setLastMoves([]);
        chess.load_pgn(pgn);
        setBoard(chess.fen());
    }

    const flipOrientation = () => {
        orientation === 'white' ? setOrientation('black') : setOrientation('white');
    }

    useEffect(() => {
        async function fetchPGN() {
            const data = await ipfs.cat(position);
            chess.load_pgn(data.toString());

            setPgn(chess.pgn());
            setBoard(chess.fen());
        }
        
        if (position) {
            fetchPGN()
        }

    }, [position]);

    return (
        <>
            <div className="chess-container">
            <div className="shadow-box">
                <Chessboard 
                    position={board}
                    orientation={orientation}
                    allowDrag={() => false} 
                    lightSquareStyle={{ backgroundColor: "rgb(244, 239, 220)"}}
                    darkSquareStyle={{ backgroundColor: "rgb(32, 87, 165)"}}
                />
            </div>
            
            </div>
            <div className="chess-desc-container"> 
                <h1> About the game: </h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Congue quisque egestas diam in arcu cursus euismod. Scelerisque felis imperdiet proin fermentum. Et malesuada fames ac turpis egestas. Quisque non tellus orci ac auctor.</p>
            </div>
            <div className="button-wrapper">
                <button className="chess-button" onClick={onClickReset}><i className="fas fa-redo-alt"></i></button>        
                <button className="chess-button" onClick={onClickBack}><i className="fas fa-step-backward"></i></button>     
                <button className="chess-button" onClick={onClickForward}><i className="fas fa-step-forward"></i></button>    
                <button className="chess-button" onClick={onClickLastMove}><i className="fas fa-fast-forward"></i></button>
                <button className="chess-button" onClick={flipOrientation}><i className="fas fa-sync"></i></button>
            </div>
        </>
    );
};

export default ChessboardWrapper;