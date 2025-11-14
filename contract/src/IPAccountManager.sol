// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IIPAccountRegistry } from "@storyprotocol/core/interfaces/registries/IIPAccountRegistry.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IPAccountManager
 * @author Gemini Code Assist
 * @notice This contract provides a simplified and secure interface for managing
 * permissions on an IP Account using the Story Protocol IIPAccountRegistry.
 * It allows the owner of this contract to grant and revoke permissions for a
 * specific operator on a specific IP Account.
 */
contract IPAccountManager is Ownable {
    IIPAccountRegistry public immutable IP_ACCOUNT_REGISTRY;

    event PermissionGranted(address indexed ipAccount, address indexed operator, bytes32 indexed permission);
    event PermissionRevoked(address indexed ipAccount, address indexed operator, bytes32 indexed permission);

    /**
     * @param _ipAccountRegistry The address of the Story Protocol IIPAccountRegistry.
     * @param _initialOwner The initial owner of this contract.
     */
    constructor(address _ipAccountRegistry, address _initialOwner) Ownable(_initialOwner) {
        IP_ACCOUNT_REGISTRY = IIPAccountRegistry(_ipAccountRegistry);
    }

    /**
     * @notice Grants a specific permission to an operator for a given IP account.
     * @dev Only the owner of this contract can call this function. The IP Account
     * itself must be owned by this contract.
     * @param _ipAccount The IP Account to grant permission on.
     * @param _operator The address that will be granted the permission.
     * @param _permission The permission to grant (e.g., keccak256("PERMIT_MINT_LICENSE")).
     */
    function grantPermission(address _ipAccount, address _operator, bytes32 _permission) external onlyOwner {
        IP_ACCOUNT_REGISTRY.setPermission(_ipAccount, _operator, _permission, true);
        emit PermissionGranted(_ipAccount, _operator, _permission);
    }

    /**
     * @notice Revokes a specific permission from an operator for a given IP account.
     * @dev Only the owner of this contract can call this function.
     * @param _ipAccount The IP Account to revoke permission on.
     * @param _operator The address whose permission will be revoked.
     * @param _permission The permission to revoke.
     */
    function revokePermission(address _ipAccount, address _operator, bytes32 _permission) external onlyOwner {
        IP_ACCOUNT_REGISTRY.setPermission(_ipAccount, _operator, _permission, false);
        emit PermissionRevoked(_ipAccount, _operator, _permission);
    }
}