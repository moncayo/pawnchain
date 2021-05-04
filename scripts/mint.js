import FirebaseConfig from '../src/config/firebaseConfig';
import firebase from 'firebase/app';
require('dotenv').config();

const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawnSync;

const { Chess } = require('chess.js');
const { ethers } = require('ethers');



const API_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const API_JSON_URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

firebase.initializeApp(FirebaseConfig);

/**
 * @dev uploads given file to IPFS
 * 
 * @param filename -- path of file to be uploaded 
 */
const uploadToIPFS = async (filename) => {
    // load file data
    const filestream = fs.createReadStream(filename);
    let data = new FormData();
    data.append('file', filestream);

    // upload to IPFS
    const ipfs_data = await axios
        .post(API_URL, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: process.env.API_KEY,
                pinata_secret_api_key: process.env.SECRET_KEY
            },
        })
        .then(res => { return res.data })
        .catch(err => console.log(err));

    return ipfs_data;
}

/**
 * @dev uploads a JSON file meant to be used for an NFT
 * 
 * @param jsonBody -- takes a JSON to be uploaded to Pinata
 */
const uploadJSONtoIPFS = async (jsonBody) => {
    // jsonBody is added directly to the API request
    const ipfs_data = await axios
        .post(API_JSON_URL, jsonBody, {
            headers: {
                pinata_api_key: process.env.API_KEY,
                pinata_secret_api_key: process.env.SECRET_KEY
            },
        })
        .then(res => { return res.data })
        .catch(err => console.log(err));

    return ipfs_data;    
}

/**
 * @dev mints an NFT onto the blockchain
 * 
 * @param hash -- CID hash of JSON file representing assets
 * @param price -- price (in wei) of the token to be minted
 * 
 * TODO: generalize for use on main chain
 */
const mintToken = async (hash, price) => {
    //const provider = new ethers.providers.JsonRpcProvider("INFURIA API");
    const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
    
    const signer = provider.getSigner(0); //
        
    const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    
    const pawnchainJsonFile = path.join('../', 'build', 'contracts', 'Pawnchain.json')
    const pawnchainAbi = require(pawnchainJsonFile).abi;
    const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, provider);
    const pawnchainWithSigner = pawnchainContract.connect(signer);

    pawnchainWithSigner
        .mintPGN(hash, price)
        .catch(e => {
            console.log(e);
            return;
        });
    
    return 'great success';
}

/**
 * @dev executes the script that uploads NFT assets and mints token
 * 
 * @param pgn_filename -- path of .pgn file to be tokenized
 * @param price -- price to set token to
 */
const scriptExecution = async (pgn_filename, price) => {
    const parsedPath = path.parse(pgn_filename);

    // parse and modify .pgn data
    const chess = new Chess();
    const pgnStr = fs.readFileSync(pgn_filename).toString();
    chess.load_pgn(pgnStr);
    chess.delete_comments();
    fs.writeFileSync(pgn_filename, chess.pgn()); 

    // generate gif
    const scriptPath = path.join(__dirname, 'chessgif.py');
    spawn('python3', [scriptPath, pgn_filename]);

    // upload files to IPFS
    const pgnData = await uploadToIPFS(pgn_filename);
    console.log('pgn uploaded');

    const gifPath = path.join(__dirname, 'gif', parsedPath.name.concat('.gif'));
    const gifData = await uploadToIPFS(gifPath);
    console.log('gif uploaded');

    // adds (white) v. (black) to JSON data
    const headerData = chess.header();
    const nameData = headerData.White.concat(' v. ', headerData.Black);

    // adds short description of game to JSON data
    const descriptionPath = path.join(__dirname, 'desc', parsedPath.name.concat('.txt'));
    const descriptionData = fs.readFileSync(descriptionPath).toString();

    const jsonBody = {
        name: nameData,
        image: gifData.IpfsHash,
        pgn: pgnData.IpfsHash,
        description: descriptionData,
    }

    const jsonData = await uploadJSONtoIPFS(jsonBody);
    console.log('json uploaded');

    const eth_to_wei = ethers.utils.parseEther(price);
    mintToken(jsonData.IpfsHash, eth_to_wei)
        .then(res => console.log(res))
        .catch(e => {
            console.log(e);
            return;
        });

    const ref = Firebase.database().ref('/').push();
    ref.set({
        'name': nameData,
        'image': gifData.IpfsHash,
        'pgn': pgnData.IpfsHash,
        'description': descriptionData,
        'price': price,
    });
}

// main script -- nodejs scripts/node.js {filename (*.pgn)} {price (ETH)}
const args = process.argv.slice(2);
const filePath = path.join(__dirname, 'pgn', args[0]);
scriptExecution(filePath, args[1])
    .catch(e => console.log(e));