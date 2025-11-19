// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IPToken
 * @notice ERC20 token for IP Asset marketplace payments
 */
contract IPToken is ERC20, Ownable {
    
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor(
        string memory name,     // From deployment script (e.g., "IP Token")
        string memory symbol,   // From deployment script (e.g., "IPT") 
        uint256 initialSupply,  // From deployment script (e.g., 1000000)
        address initialOwner    // From deployment script (deployer address)
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _mint(initialOwner, initialSupply * 10**decimals());
    }
    
    /**
     * @notice Mints tokens to specified address (for testing/distribution)
     * @param to Address to mint tokens to (from admin interface)
     * @param amount Amount to mint (from admin interface)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @notice Burns tokens from caller's balance
     * @param amount Amount to burn (from frontend user action)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}