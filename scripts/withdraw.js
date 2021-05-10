const path = require('path')
const ethers = require('ethers');
require('dotenv').config();

function withdraw() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ROPSTEN);
    
    const signer = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC, process.env.WALLET_PATH)
    
    const wallet = signer.connect(provider);
    const pawnchainAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    
    const pawnchainJsonFile = path.join('../', 'build', 'contracts', 'Pawnchain.json')
    const pawnchainAbi = require(pawnchainJsonFile).abi;
    const pawnchainContract = new ethers.Contract(pawnchainAddress, pawnchainAbi, wallet);

    pawnchainContract.withdraw()
        .then(tx => console.log(tx))
        .catch(e => console.log(e))
}

withdraw()