// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pawnchain is ERC721URIStorage, Ownable, IERC721Receiver {
    uint256 public  _tokenCounter;
    
    mapping(string => uint256) public _hashes;
    mapping(uint256 => uint256) public _prices;

    event tokenMinted(uint256 tokenID, uint256 price);
    event tokenBought(uint256 tokenID);

    constructor() ERC721("Pawnchain", "PAWN") Ownable() {
        _tokenCounter = 0;
    }
    
    /**
        @dev Mint an NFT representing a chess game 

        @param _hash - hash of PGN data hosted on IPFS
        @param _price - price to associate with game collectible
     */
    function mintPGN(string memory _hash, uint256 _price) external onlyOwner returns (uint256) {
        require(_hashes[_hash] != 1, "This hash already exists!");

        _tokenCounter = _tokenCounter + 1;

        _safeMint(address(this), _tokenCounter);
        _setTokenURI(_tokenCounter, _hash);

        _hashes[_hash] = 1;
        _prices[_tokenCounter] = _price;

        emit tokenMinted(_tokenCounter, _price);

        return _tokenCounter;
    }

    /**
        @dev Select a token to buy from those available

        @param _tokenID - token desired to be bought
     */
    function vendingMachine(uint256 _tokenID) external payable {
        require(msg.value == _prices[_tokenID], "You did not pay the correct amount!");
        require(ownerOf(_tokenID) == address(this), "This token is no longer available!");

        _transfer(address(this), msg.sender, _tokenID);

        emit tokenBought(_tokenID);
    }

    /**
        @dev Withdraw funds from contract
     */
    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "You don't have any ETH to withdraw!");

        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Something went wrong...");
    }

    /**
        @dev Contract can handle receiving its own tokens
     */
    function onERC721Received(address, address, uint256, bytes memory)
        public
        virtual
        override
        returns (bytes4) {
            return this.onERC721Received.selector;
        }

    /**
        @dev Change price of token

        @param _tokenID -- tokenID to change the price of
        @param _price -- new price to set
     */
    function changePrice(uint256 _tokenID, uint256 _price) external onlyOwner {
        _prices[_tokenID] = _price;
    }
}