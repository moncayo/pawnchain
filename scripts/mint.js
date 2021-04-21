require('dotenv').config({ path: '../.env' });

const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const { Chess } = require('chess.js');
const { ethers } = require('ethers');

const uploadPGN = async (filename) => {
    const API_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const chess = new Chess();

    const pgnBuf = await fs.readFileSync(filename);
    const pgnStr = pgnBuf.toString();
    chess.load_pgn(pgnStr);
    chess.delete_comments();

    await fs.writeFileSync(filename, chess.pgn()); 

    // generate gif
    const scriptPath = path.join(__dirname, 'chessgif.py');
    await spawn('python3', [scriptPath, filename]);

    const filestream = fs.createReadStream(filename);
    let data = new FormData();
    data.append('file', filestream);

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

const mintToken = async (filename, amount, price) => {
    //const provider = new ethers.providers.JsonRpcProvider("INFURIA API");
    const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
    
    const signer = provider.getSigner(1); //
        
    const pawnchainAddress = process.env.CONTRACT_ADDRESS;
    
    const pawnchainJsonFile = path.join(__dirname, 'build', 'contracts', 'Pawnchain.json')
    const pawnchainAbi = require(pawnchainJsonFile).abi;
    const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, provider);
    const pawnchainWithSigner = pawnchainContract.connect(signer);

    const pinataResponse = await uploadPGN(filename);
    
    pawnchainWithSigner
        .mintPGN(pinataResponse.IpfsHash, amount, price)
        .then(res => { return res.hash; })
        .catch(e => console.log(e));
}


//const pgnPath = path.join('./', 'pgn', 'gameofthecentury.pgn');
//uploadPGN(pgnPath);