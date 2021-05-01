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
            const CID = position;
            const data = await ipfs.cat(CID);
            chess.load_pgn(data.toString());

            setPgn(chess.pgn());
            setBoard(chess.fen());
        }
        
        if (position) {
            fetchPGN()
        }

    }, [position]);

    return (
        <div>
            <Chessboard 
                position={board}
                orientation={orientation}
                allowDrag={() => false} 
            />
            <div className="button-wrapper">
                <button className="chess-button" onClick={onClickReset}>First Move</button>        
                <button className="chess-button" onClick={onClickBack}>Back</button>     
                <button className="chess-button" onClick={onClickForward}>Forward</button>    
                <button className="chess-button" onClick={onClickLastMove}>Last Move</button>
                <button className="chess-button" onClick={flipOrientation}>Flip board</button>
            </div>
        </div>
    );
};

export default ChessboardWrapper;