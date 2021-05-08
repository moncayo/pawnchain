import React from 'react';
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { account } from '../actions/accountActions';
import Metamask_icon from '../metamask-logo2.png'

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
            <h1 className="logo-text">Pawnchain</h1> 
            { currentAccount ? <h1 className="address-container">{currentAccount}</h1> : <div className="connect-button-wrapper"> <button className="connect-button" onClick={connectWallet}>Connect<img className="metamask-icon" src={Metamask_icon} alt="metamask-logo.png"/></button></div> }
        </div>
    );
}

export default Navbar;