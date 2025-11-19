// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { ILicensingModule } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { ILicenseRegistry } from "@story-protocol/protocol-core/contracts/interfaces/registries/ILicenseRegistry.sol";
import { IIPAssetRegistry } from "@story-protocol/protocol-core/contracts/interfaces/registries/IIPAssetRegistry.sol";

/**
 * @title DerivativeManager
 * @notice Manages derivative IP Asset registration and relationships
 */
contract DerivativeManager {
    ILicensingModule public immutable LICENSING_MODULE;
    ILicenseRegistry public immutable LICENSE_REGISTRY;
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;

    event DerivativeRegistered(address indexed childIpId, address indexed parentIpId, uint256[] licenseTokenIds);

    constructor(address _licensingModule, address _licenseRegistry, address _ipAssetRegistry) {
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        LICENSE_REGISTRY = ILicenseRegistry(_licenseRegistry);
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
    }

    /**
     * @notice Registers an IP Asset as a derivative using license tokens
     * @param childIpId The derivative IP Asset
     * @param licenseTokenIds Array of license token IDs to use
     * @param maxRts Maximum revenue token share
     */
    function registerDerivativeWithLicenseTokens(
        address childIpId,
        uint256[] calldata licenseTokenIds,
        uint256 maxRts
    ) external {
        LICENSING_MODULE.registerDerivativeWithLicenseTokens({
            childIpId: childIpId,
            licenseTokenIds: licenseTokenIds,
            royaltyContext: "", // empty for PIL
            maxRts: maxRts
        });

        // Get parent IP from the first license token (assuming single parent for simplicity)
        // In practice, you might need to handle multiple parents
        address parentIpId = address(0); // This would need to be derived from license token
        emit DerivativeRegistered(childIpId, parentIpId, licenseTokenIds);
    }

    /**
     * @notice Checks if an IP has derivative IPs
     * @param ipId The IP Asset to check
     * @return hasDerivatives True if the IP has derivatives
     */
    function hasDerivativeIps(address ipId) external view returns (bool hasDerivatives) {
        return LICENSE_REGISTRY.hasDerivativeIps(ipId);
    }

    /**
     * @notice Checks if an IP is a derivative
     * @param ipId The IP Asset to check
     * @return isDerivative True if the IP is a derivative
     */
    function isDerivativeIp(address ipId) external view returns (bool isDerivative) {
        return LICENSE_REGISTRY.isDerivativeIp(ipId);
    }

    /**
     * @notice Checks if there's a parent-child relationship
     * @param parentIpId The parent IP Asset
     * @param childIpId The child IP Asset
     * @return isParent True if parentIpId is parent of childIpId
     */
    function isParentIp(address parentIpId, address childIpId) external view returns (bool isParent) {
        return LICENSE_REGISTRY.isParentIp(parentIpId, childIpId);
    }

    /**
     * @notice Gets the count of parent IPs for a derivative
     * @param childIpId The derivative IP Asset
     * @return count Number of parent IPs
     */
    function getParentIpCount(address childIpId) external view returns (uint256 count) {
        return LICENSE_REGISTRY.getParentIpCount(childIpId);
    }

    /**
     * @notice Gets the count of derivative IPs for a parent
     * @param parentIpId The parent IP Asset
     * @return count Number of derivative IPs
     */
    function getDerivativeIpCount(address parentIpId) external view returns (uint256 count) {
        return LICENSE_REGISTRY.getDerivativeIpCount(parentIpId);
    }

    /**
     * @notice Gets a parent IP by index
     * @param childIpId The derivative IP Asset
     * @param index The index of the parent
     * @return parentIpId The parent IP Asset address
     */
    function getParentIp(address childIpId, uint256 index) external view returns (address parentIpId) {
        return LICENSE_REGISTRY.getParentIp(childIpId, index);
    }

    /**
     * @notice Gets a derivative IP by index
     * @param parentIpId The parent IP Asset
     * @param index The index of the derivative
     * @return childIpId The derivative IP Asset address
     */
    function getDerivativeIp(address parentIpId, uint256 index) external view returns (address childIpId) {
        return LICENSE_REGISTRY.getDerivativeIp(parentIpId, index);
    }
}