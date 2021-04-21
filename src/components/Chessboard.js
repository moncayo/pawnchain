import React, { useEffect, useState } from 'react'; 
import Chessboard from 'chessboardjsx';

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const Chess = require('chess.js');
const chess = new Chess();

const ChessboardWrapper = props => {    
    const [pgn, setPgn] = useState('')
    const [board, setBoard] = useState('')
    const [lastMoves, setLastMoves] = useState([]); // Last in First Out
    const [autoPlay, toggleAutoPlay] = useState(false);
    const [orientation, setOrientation] = useState('white');

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
        }
        setBoard(chess.fen());
    }

    const onClickReset = () => {
        setLastMoves(chess.history({ verbose: true }).reverse());
        chess.reset();
        setBoard(chess.fen());
    }

    const onClickLastMove = () => {
        setLastMoves([]);
        chess.load_pgn(pgn);
        setBoard(chess.fen());
    }

    const onClickAutoplay = () => {
        onClickReset();
        toggleAutoPlay(true);
    }

    const flipOrientation = () => {
        orientation === 'white' ? setOrientation('black') : setOrientation('white');
    }

    useEffect(() => {
        async function startIPFS() {
            const CID = props.CID;
            const data = await ipfs.get(CID);
            chess.load_pgn(data[0].content.toString());

            setPgn(chess.pgn());
            setBoard(chess.fen());
        }

        startIPFS();

    }, [props.CID]);

    useEffect(() => {
        let interval = null;

        if (autoPlay) {
            interval = setInterval(() => {
                onClickForward();
            }, 1000);             
        }
        
        if (lastMoves.length === 0 || !autoPlay) {
            clearInterval(interval); 
            toggleAutoPlay(false);
        }
    }, [autoPlay, lastMoves]);

    return (
        <div>
            <Chessboard 
                position={board}
                orientation={orientation}
                allowDrag={() => false} 
            />
            <button onClick={onClickReset}>First Move</button>        
            <button onClick={onClickBack}>Back</button>     
            <button onClick={onClickAutoplay}>Auto play</button>
            <button onClick={onClickForward}>Forward</button>    
            <button onClick={onClickLastMove}>Last Move</button>
            <button onClick={flipOrientation}>Flip board</button>
        </div>
    );
};

export default ChessboardWrapper;