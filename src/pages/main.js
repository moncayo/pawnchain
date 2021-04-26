import React, { useState, useEffect } from 'react'; 
import ChessboardWrapper from '../components/Chessboard';
import Preview from '../components/Preview';

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
    const [JSONdata, setJSONdata] = useState([]);
    const [prices, setPrices] = useState([]);
    const [address, setAddress] = useState('');

    const connectWallet = async () => {
        ethereum.request({ method: 'eth_requestAccounts' })
                .then(wallet => setAddress(wallet[0]));
    }

    ethereum.on('accountsChanged', function (accounts) {
        setAddress(accounts[0]);
    });
    
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


    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
            {JSONdata.length > 0 && <ChessboardWrapper 
                //TODO: click on preview updates chessboard state
                CID={JSONdata[0].pgn}
                />
            }
            <ul>
                {JSONdata.length > 0 && 
                    JSONdata.map((json, index) => {
                        return <Preview 
                            key={index}
                            gif={`https://ipfs.io/ipfs/${json.image}`}
                            header={json.name}
                            price={prices[index]}
                            account={address}
                            tokenID={index + 1} // index starts at 0, tokenID at 1
                        />
                    })
                }
            </ul>
        </div>
    );
};

export default MainPage;