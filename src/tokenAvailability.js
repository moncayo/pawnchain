const { ethers } = require('ethers');
const pawnchainABI = require('./abi/Pawnchain.json').abi
require('dotenv').config();

async function tokenAvailability(tokenID) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    
    const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainABI, signer);

    const result = await pawnchainContract.ownerOf(tokenID);
    return result === process.env.REACT_APP_CONTRACT_ADDRESS;
}

export default tokenAvailability;