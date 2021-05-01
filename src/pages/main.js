import React, { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import './main.css'
import { listTokens } from '../actions/tokenActions';

require('dotenv').config();

const MainPage = () => {    
    const dispatch = useDispatch();

    const tokenSelector = useSelector(state => state.tokens);
    const { tokens, loading } = tokenSelector;

    const [position, setPosition] = useState('');
    
    useEffect(() => {
        dispatch(listTokens());
    }, [dispatch]);

    const changeBoard = (pgn) => {
        setPosition(pgn);
    }

    return (
        <div>
            <Navbar />
            <div className="chess-wrapper">
                {position &&<ChessboardWrapper 
                    CID={position}
                    /> 
                }
            </div>
        <div className="preview-wrapper">
            <div className="gif-wrapper"></div>
                {   !loading 
                    ? tokens.map((json, index) => {
                        return <div className="gif" onClick={() => changeBoard(json.pgn)}> 
                            <Preview 
                                key={index}
                                gif={`https://ipfs.io/ipfs/${json.image}`}
                                header={json.name}
                                price={json.price}
                                tokenID={index + 1} // index starts at 0, tokenID at 1
                            />
                        </div>
                    })
                    : <h1>Loading</h1>
                }
        </div>
        </div>
    );
};

export default MainPage;