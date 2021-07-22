import React, { useEffect, useState } from 'react'; 
import Chessboard from 'chessboardjsx';
import './Chessboard.css'
import { useSelector } from 'react-redux';
import BuyButton from './BuyButton';

const fetch = require('node-fetch');
const Chess = require('chess.js');
const chess = new Chess();
const ethers = require('ethers');

const ChessboardWrapper = () => {    
    const [pgn, setPgn] = useState('')
    const [board, setBoard] = useState('')
    const [lastMoves, setLastMoves] = useState([]); // Last in First Out
    const [orientation, setOrientation] = useState('white');
    const [whiteName, setWhiteName] = useState('')
    const [blackName, setBlackName] = useState('')
    const [tokenHolder, setTokenHolder] = useState('')

    const boardSelector = useSelector(state => state.boardPosition);
    const { position } = boardSelector;

    const accountSelector = useSelector(state => state.accountStatus)
    const { currentAccount } = accountSelector;

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
            fetch(`https://ipfs.io/ipfs/${position.pgn}`)
                .then(res => res.text())
                .then(pgn => {
                    chess.load_pgn(pgn);
                    setPgn(chess.pgn());
                    setBoard(chess.fen());        
                })    
        }
        
        if (position) {
            fetchPGN();
            const names = position.name.split(' vs. ');
            setWhiteName(names[0])
            setBlackName(names[1])

                const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_MAINNET);
                            const signer = provider.getSigner();
                            const pawnchainAbi = require('../abi/Pawnchain.json').abi
                            const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
                            
                            const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, signer);
                        
                            pawnchainContract.ownerOf(position.tokenID)
                                .then(hodl => setTokenHolder(hodl))
                                .catch(e => console.log('ERR'))
        }

    }, [position]);

    return (
        <>
            <div className="chess-container">
                <div className="chessboard-container">
                    <div className="shadow-box">
                        <Chessboard 
                            position={board}
                            orientation={orientation}
                            allowDrag={() => false} 
                            lightSquareStyle={{ backgroundColor: "rgb(244, 239, 220)"}}
                            darkSquareStyle={{ backgroundColor: "rgb(32, 87, 165)"}}
                        />
                        
                    </div>
                    <div className="button-wrapper">
                        <button className="chess-button" onClick={onClickReset}><i className="fas fa-redo-alt"></i></button>        
                        <button className="chess-button" onClick={onClickBack}><i className="fas fa-step-backward"></i></button>     
                        <button className="chess-button" onClick={onClickForward}><i className="fas fa-step-forward"></i></button>    
                        <button className="chess-button" onClick={onClickLastMove}><i className="fas fa-fast-forward"></i></button>
                        <button className="chess-button" onClick={flipOrientation}><i className="fas fa-sync"></i></button>
                    </div>
                </div>

                
                { whiteName !== ""
                ?<div className="chess-desc-container"> 
                    {whiteName || blackName
                        ?<div className="discription-wrapper">
                            <h1 className="name-wrapper">{whiteName}</h1>
                            <h1 className="name-wrapper">vs.</h1>
                            <h1 className="name-wrapper">{blackName}</h1>
                            <p className="discription-wrapper">{position.description}</p>
                         </div>
                        : null
                    }
                    {tokenHolder
                        ? <div className ="owner-wrapper"><h1 className ="owner-container">Owner</h1><h2 className="address-container">{tokenHolder}</h2></div>
                        : null
                    }
                    {
                        position
                        ? <BuyButton
                                account={currentAccount}
                                price={position.price}
                                tokenID={position.tokenID}
                            />
                        : null
                    }

                </div>
                : null
                }
        </div>
            
        </>
    );
};

export default ChessboardWrapper;
