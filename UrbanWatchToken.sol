// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract UrbanWatchToken is ERC20, Ownable {
    constructor() ERC20("UrbanWatchToken", "UWT") Ownable(msg.sender) {}
 
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10 ** decimals());
    }
 
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount * 10 ** decimals());
    }
 
    function donateTo(address payable orgWallet) external payable {
        require(msg.value > 0, "Must send ETH");
        orgWallet.transfer(msg.value);
    }
}
