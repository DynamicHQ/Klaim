// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IAccessController } from "@storyprotocol/core/contracts/interfaces/access/IAccessController.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IPAccountManager
 * @notice Provides a simplified interface for managing permissions on IP Accounts
 * via Story Protocol's Access Controller.
 */
contract IPAccountManager is Ownable {
    IAccessController public immutable ACCESS_CONTROLLER;

    event PermissionGranted(address indexed ipAccount, address indexed signer, address indexed to, bytes4 func, uint8 permission);
    event PermissionRevoked(address indexed ipAccount, address indexed signer, address indexed to, bytes4 func);

    /**
     * @param _accessController The address of the Story Protocol Access Controller.
     * @param _initialOwner The initial owner of this contract.
     */
    constructor(address _accessController, address _initialOwner) Ownable(_initialOwner) {
        ACCESS_CONTROLLER = IAccessController(_accessController);
    }

    /**
     * @notice Grants a specific permission to a signer for a given IP account.
     * @param ipAccount The IP Account to grant permission on.
     * @param signer The address that will be granted the permission.
     * @param to The module/contract the signer can call.
     * @param func The function selector of `to`.
     * @param permission The permission level (0=ABSTAIN, 1=ALLOW, 2=DENY).
     */
    function grantPermission(
        address ipAccount,
        address signer,
        address to,
        bytes4 func,
        uint8 permission
    ) external onlyOwner {
        ACCESS_CONTROLLER.setPermission(ipAccount, signer, to, func, permission);
        emit PermissionGranted(ipAccount, signer, to, func, permission);
    }

    /**
     * @notice Revokes a specific permission (sets to ABSTAIN).
     */
    function revokePermission(
        address ipAccount,
        address signer,
        address to,
        bytes4 func
    ) external onlyOwner {
        ACCESS_CONTROLLER.setPermission(ipAccount, signer, to, func, 0); // 0 = ABSTAIN
        emit PermissionRevoked(ipAccount, signer, to, func);
    }
}
