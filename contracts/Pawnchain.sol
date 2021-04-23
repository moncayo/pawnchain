// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// TODO: emit events
// TODO: add ipfs:// _baseURI()
contract Pawnchain is ERC721URIStorage, Ownable {
    uint256 public  _tokenCounter;
    uint256 private _myETH;
    
    mapping(string => uint256) public _hashes;
    mapping(uint256 => uint256) public _prices;

    constructor() ERC721("Pawnchain", "PAWN") Ownable() {
        _tokenCounter = 1;
    }
    
    /**
        @dev Mint an NFT representing a chess game 

        @param _hash - hash of PGN data hosted on IPFS
        @param _price - price to associate with game collectible
     */
    function mintPGN(string memory _hash, uint256 _price) external onlyOwner {
        require(_hashes[_hash] != 1, "This hash already exists");

        // Tokens belong to minter and contract is approved to sell
        _safeMint(msg.sender, _tokenCounter);
        _setTokenURI(_tokenCounter, _hash);
        approve(address(this), _tokenCounter);

        _hashes[_hash] = 1;
        _prices[_tokenCounter] = _price;
        _tokenCounter = _tokenCounter + 1;
    }

    /**
        @dev Select a token to buy from those available

        @param _tokenID - token desired to be bought
     */
    function vendingMachine(uint256 _tokenID) external payable {
        require(msg.value == _prices[_tokenID], "You did not pay the correct amount!");

        safeTransferFrom(address(this), msg.sender, _tokenID);
        _myETH = _myETH + msg.value;
    }

    /**
    
     */
    function withdraw() external onlyOwner {
        (bool success,) = payable(msg.sender).call{value: _myETH}("");
        require(success, "Something went wrong...");

        _myETH = 0;
    }
}