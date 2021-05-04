import React from 'react';
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { account } from '../actions/accountActions';

const ethereum = window.ethereum;

const Navbar = () => {
    const dispatch = useDispatch();
    const accountStatus =  useSelector(state => state.accountStatus);
    const { currentAccount } = accountStatus;
    
    const connectWallet = async () => {
        ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(wallet => dispatch(account(wallet[0])))
    }

    ethereum.on('accountsChanged', function (accounts) {
        dispatch(account(accounts[0]));
    });

    return (
        <div className="nav-wrapper">
            <h1 className="logo-text">PawnChain</h1> 
            { currentAccount ? <h1 className="address-container">{currentAccount}</h1> : <button onClick={connectWallet}>Connect Metamask</button> }
        </div>
    );
}

export default Navbar;