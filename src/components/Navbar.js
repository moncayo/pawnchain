import React, { useState } from 'react';
import './Navbar.css'
const ethereum = window.ethereum;

const Navbar = () => {
    const [address, setAddress] = useState('');

    const connectWallet = async () => {
        ethereum.request({ method: 'eth_requestAccounts' })
                .then(wallet => setAddress(wallet))
                .catch(e => console.log(e));
    }

    ethereum.on('accountsChanged', function (accounts) {
        setAddress(accounts[0]);
    });

    return (
        <div className="nav-wrapper">
            <h1 className="logo-text">PawnChain</h1> 
            { address ? <h1 className="address-container">{address}</h1> : <button onClick={connectWallet}>Connect Metamask</button> }
        </div>
    );
}

export default Navbar;