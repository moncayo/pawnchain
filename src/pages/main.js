import React, { useState, useEffect } from 'react'; 
import { useSelector } from 'react-redux';
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import './main.css'

require('dotenv').config();

const ipfsHttpClient = require('ipfs-http-client');
const ipfs = ipfsHttpClient("ipfs.infura.io");

const { ethers } = require('ethers');
const ethereum = window.ethereum;

const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const pawnchainAbi = require('../abi/Pawnchain.json').abi;
const pawnchainContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, pawnchainAbi, provider);
const pawnchainWithSigner = pawnchainContract.connect(signer);

const MainPage = () => {    
    const accountStatus = useSelector(state => state.accountStatus);
    const { currentAccount } = accountStatus;

    const [JSONdata, setJSONdata] = useState([]);
    const [prices, setPrices] = useState([]);
    const [position, setPosition] = useState('');
    
    useEffect(() => {
        async function fetchContractData() {
            const tokenCount = await pawnchainWithSigner
                                        ._tokenCounter()
                                        .then(count => { return count.toNumber() })
                                        .catch(e => console.log(e));

            for (let i = 1; i <= tokenCount; i++) {
                pawnchainWithSigner
                    .tokenURI(i)
                    .then(res => {
                        ipfs.cat(res)
                            .then(res => {
                                const contents = JSON.parse(res.toString());
                                setJSONdata(JSONdata => [...JSONdata, contents]);
                            })
                            .catch(e => console.log(e));
                    });

                pawnchainWithSigner
                    ._prices(i)
                    .then(res => {
                        const price = ethers.utils.formatUnits(res.toString(), "ether");
                        setPrices(prices => [...prices, price])
                    })
            }
        }
        fetchContractData();
    }, []);

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
                {   currentAccount 
                    ? JSONdata.map((json, index) => {
                        return <div className="gif" onClick={() => changeBoard(json.pgn)}> 
                            <Preview 
                                key={index}
                                gif={`https://ipfs.io/ipfs/${json.image}`}
                                header={json.name}
                                price={prices[index]}
                                tokenID={index + 1} // index starts at 0, tokenID at 1
                            />
                        </div>
                    })
                    : <h1>Connect Metamask</h1>
                }
        </div>
        </div>
    );
};

export default MainPage;