import React, { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import './main.css'

import { listTokens } from '../actions/tokenActions';
import '../config/firebaseConfig';

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
            {
                /**
                 * Database receives tokens as JSONs but not as an array
                 * Has to interate through an object with key pairs
                 * 
                 * example:
                 * {
                 *  item1: {...},
                 *  item2: {...}
                 * }
                 * 
                 * json[1] is the value of key (which is in json[0] and we do not need)
                 * json[0] -> item1, json[1] -> {actual object data}
                 */
            }
            <div className="preview-wrapper">
                    {   !loading 
                        ? Object.entries(tokens).map((json, index) => {
                            return <div key={index} className="gif">
                                        <Preview 
                                            token={json[1]}
                                            tokenID={index + 1} // token IDs start at 1
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