import React, { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import './main.css'
import Loading from "../components/loading/loading.js"
import { listTokens } from '../actions/tokenActions';

require('../config/firebaseConfig');
require('dotenv').config();

const MainPage = () => {    
    const dispatch = useDispatch();
    const CHAIN_ID = "3"

    const tokenSelector = useSelector(state => state.tokens);
    const { tokens, loading } = tokenSelector;

    useEffect(() => {
        dispatch(listTokens());
    }, [dispatch]);

    return (
        <div className="home" id="top">
            <Navbar/>
            {
            window.ethereum.networkVersion === CHAIN_ID
            ?
            <div>
            <div className="chess-wrapper">
                {   !loading 
                    ? <ChessboardWrapper/>
                    : <Loading/>
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
                    {   tokens 
                        ? Object.entries(tokens).map((json, index) => {
                            return <div key={index} className="gif">
                                        <Preview 
                                            token={json[1]}
                                            tokenID={index + 1} // token IDs start at 1
                                        />
                                    </div>
                        })
                        : <Loading/>
                    }
            </div>
            </div>
            : null
            }
        </div>
    );
};

export default MainPage;