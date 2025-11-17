// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { ILicensingModule } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { ILicenseRegistry } from "@story-protocol/protocol-core/contracts/interfaces/registries/ILicenseRegistry.sol";
import { IPILicenseTemplate } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";

/**
 * @title LicenseAttacher
 * @notice Handles attaching license terms to IP Assets
 */
contract LicenseAttacher {
    ILicensingModule public immutable LICENSING_MODULE;
    ILicenseRegistry public immutable LICENSE_REGISTRY;
    IPILicenseTemplate public immutable PIL_TEMPLATE;

    event LicenseTermsAttached(address indexed ipId, address indexed licenseTemplate, uint256 indexed licenseTermsId);

    constructor(address _licensingModule, address _licenseRegistry, address _pilTemplate) {
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        LICENSE_REGISTRY = ILicenseRegistry(_licenseRegistry);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
    }

    /**
     * @notice Attaches license terms to an IP Asset
     * @dev Only the owner of the IP Asset can attach license terms
     * @param ipId The IP Asset to attach terms to
     * @param licenseTermsId The license terms ID to attach
     */
    function attachLicenseTerms(address ipId, uint256 licenseTermsId) external {
        LICENSING_MODULE.attachLicenseTerms(ipId, address(PIL_TEMPLATE), licenseTermsId);
        emit LicenseTermsAttached(ipId, address(PIL_TEMPLATE), licenseTermsId);
    }

    /**
     * @notice Checks if IP has attached license terms
     * @param ipId The IP Asset to check
     * @param licenseTermsId The license terms ID to check
     * @return hasTerms True if the IP has the specified license terms attached
     */
    function hasAttachedLicenseTerms(address ipId, uint256 licenseTermsId) external view returns (bool hasTerms) {
        return LICENSE_REGISTRY.hasIpAttachedLicenseTerms(ipId, address(PIL_TEMPLATE), licenseTermsId);
    }

    /**
     * @notice Gets the count of attached license terms for an IP
     * @param ipId The IP Asset to check
     * @return count Number of attached license terms
     */
    function getAttachedLicenseTermsCount(address ipId) external view returns (uint256 count) {
        return LICENSE_REGISTRY.getAttachedLicenseTermsCount(ipId);
    }

    /**
     * @notice Gets attached license terms by index
     * @param ipId The IP Asset to check
     * @param index The index of the license terms
     * @return licenseTemplate The license template address
     * @return licenseTermsId The license terms ID
     */
    function getAttachedLicenseTerms(address ipId, uint256 index) 
        external 
        view 
        returns (address licenseTemplate, uint256 licenseTermsId) 
    {
        return LICENSE_REGISTRY.getAttachedLicenseTerms(ipId, index);
    }
}