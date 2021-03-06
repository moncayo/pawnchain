const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawnSync;

const { Chess } = require('chess.js');
const { ethers } = require('ethers');

const API_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const API_JSON_URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

const firebase = require('firebase/app');
require('firebase/database');
require('dotenv').config();

const FirebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FREACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
}

firebase.initializeApp(FirebaseConfig);

/**
 * @dev uploads given file to IPFS
 * 
 * @param filename -- path of file to be uploaded 
 */
async function uploadToIPFS(filename) {
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
        
    return ipfs_data.data;
    
}

/**
 * @dev uploads a JSON file meant to be used for an NFT
 * 
 * @param jsonBody -- takes a JSON to be uploaded to Pinata
 */
async function uploadJSONtoIPFS(jsonBody) {
    // jsonBody is added directly to the API request
    const ipfs_data = await axios
        .post(API_JSON_URL, jsonBody, {
            headers: {
                pinata_api_key: process.env.API_KEY,
                pinata_secret_api_key: process.env.SECRET_KEY
            },
        })

    return ipfs_data.data;    
}

/**
 * @dev mints an NFT onto the blockchain
 * 
 * @param hash -- CID hash of JSON file representing assets
 * @param price -- price (in wei) of the token to be minted
 * 
 */
function mintToken(hash, price) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_MAINNET);
    
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY)
    
    const wallet = signer.connect(provider);
    const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    
    const pawnchainJsonFile = path.join('../', 'build', 'contracts', 'Pawnchain.json')
    const pawnchainAbi = require(pawnchainJsonFile).abi;
    const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, wallet);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    pawnchainContract.estimateGas.mintPGN(hash, price, {
        gasLimit: 1000000000
    })
    .then(tx => {
        console.log(`estimated gas price: ${ethers.utils.formatEther(tx.toString())} ETH / ${ethers.utils.formatUnits(tx.toString(), 'gwei')} gwei`)
        readline.question('proceed? (y/n): ', answer => {
            if (answer === 'y') {
                pawnchainContract.mintPGN(hash, price, {
                    gasLimit: tx.toBigInt()
                })
                .then(res => {
                    console.log('Token minted...')
                    console.log(`tx hash: ${res.hash}`)
                })
                .catch(e => console.log(e))
            } else {
                throw new Error('ABORTING TX')
            } 
            readline.close();
        })
    })

    return true;
}   

/**
 * @dev executes the script that uploads NFT assets and mints token
 * 
 * @param pgn_filename -- path of .pgn file to be tokenized
 * @param price -- price to set token to
 */
async function scriptExecution(pgn_filename, price) {
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
    console.log('pgn uploaded\n\n', pgnData);

    const gifPath = path.join(__dirname, 'gif', parsedPath.name.concat('.gif'));
    const gifData = await uploadToIPFS(gifPath);
    console.log('\ngif uploaded\n\n', gifData);

    // adds (white) v. (black) to JSON data
    const headerData = chess.header();
    const nameData = headerData.White.concat(' vs. ', headerData.Black);

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
    console.log('\njson uploaded\n\n', jsonData);

    const eth_to_wei = ethers.utils.parseEther(price);
    
    mintToken(jsonData.IpfsHash, eth_to_wei);

    const ref = firebase.database().ref('/').push();
    ref.set({
        'name': nameData,
        'image': gifData.IpfsHash,
        'pgn': pgnData.IpfsHash,
        'description': descriptionData,
        'price': price,
    })
    .then(() => console.log("Pushing to database..."))
    .catch(e => console.log(e));    
}

// main script -- nodejs scripts/node.js {filename (*.pgn)} {price (ETH)}
const args = process.argv.slice(2);
const filePath = path.join(__dirname, 'pgn', args[0]);
scriptExecution(filePath, args[1]).catch(e => console.log(e));
