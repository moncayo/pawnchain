// SPDX-License-Identifier: MIT

// TODO: set functions so only owner of contract can call

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Pawnchain is ERC1155 {
    uint256 _tokenCounter;
    uint256 _myETH;
    
    // _hashes and _pgns are probably redundant...
    mapping(string => uint256) private _hashes;
    mapping(uint256 => string) private _pgns;
    mapping(uint256 => uint256) private _prices;

    constructor() ERC1155("ipfs://{hash}") {
        _tokenCounter = 1;
    }
    
    /**
        @dev Mint a a batch of NFTs representing a chess game

        @param _hash - hash of PGN data hosted on IPFS
        @param _amount - amount of collectibles to be minted
        @param _price - price to associate with game collectible
     */
    function mintPGN(string memory _hash, uint256 _amount, uint256 _price) external {
        require(_hashes[_hash] != 1, "This hash already exists");
        
        // Tokens belong to minter and contract is approved to sell
        _mint(msg.sender, _tokenCounter, _amount, "");
        setApprovalForAll(address(this), true);

        _hashes[_hash] = 1;
        _prices[_tokenCounter] = _price;
        _pgns[_tokenCounter] = _hash;

        _tokenCounter = _tokenCounter + 1;
    }

    /**
        @dev Select a token to buy from those available

        @param _tokenID - token desired to be bought
        @param _amount - amount of token to be bought
     */
    function vendingMachine(uint256 _tokenID, uint256 _amount) external payable {
        require(msg.value == (_amount * _prices[_tokenID]), "You did not pay the correct amount!");

        safeTransferFrom(address(this), msg.sender, _tokenID, _amount, "");
        _myETH = _myETH + msg.value;
    }

    /**
    
     */
    function withdraw() external {
        (bool success,) = payable(msg.sender).call{value: _myETH}("");
        require(success, "Something went wrong...");

        _myETH = 0;
    }

    /**

    
     */
    function transferOwnership() external {
        
    }

}