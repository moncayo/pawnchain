require('dotenv').config();

const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { Chess } = require('chess.js');

const uploadPGN = async (filename) => {
    const API_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const chess = new Chess();

    const pgnBuf = await fs.readFileSync(filename);
    const pgnStr = pgnBuf.toString();
    chess.load_pgn(pgnStr);
    chess.delete_comments();

    await fs.writeFileSync(filename, chess.pgn()); 

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

const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");

const signer = provider.getSigner(1);

const path = require('path');
const pawnchainAddress = "0x609f8D342AD9fD55CeC63Ec52ed2fADfeF774cdA"

const pawnchainJsonFile = path.join(__dirname, 'build', 'contracts', 'Pawnchain.json')
const pawnchainAbi = require(pawnchainJsonFile).abi;
const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, provider);
const contractWithSigner = pawnchainContract.connect(signer);

contractWithSigner
    .mintPGN("test_hash", 1, 1)
    .then(res => console.log(res));