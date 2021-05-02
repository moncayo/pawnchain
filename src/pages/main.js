import React, { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import './main.css'

import { listTokens } from '../actions/tokenActions';

require('dotenv').config();

//TODO: replace LOADING with loading spinners
const MainPage = () => {    
    const dispatch = useDispatch();

    const tokenSelector = useSelector(state => state.tokens);
    const { tokens, loading } = tokenSelector;

    useEffect(() => {
        dispatch(listTokens());
    }, [dispatch]);

    return (
        <div className="home" id="top">
            <Navbar/>
            <div className="chess-wrapper">
                {   !loading 
                    ? <ChessboardWrapper/>
                    : <h1>Loading...</h1> 
                }
            </div>
            <div className="preview-wrapper">
                    {   !loading 
                        ? tokens.map((json, index) => {
                            return <div className="gif">
                                        <Preview 
                                            token={json}
                                            key={index}
                                            tokenID={index + 1}
                                        />
                                    </div>
                        })
                        : <h1>Loading...</h1>
                    }
            </div>
        </div>
    );
};

export default MainPage;