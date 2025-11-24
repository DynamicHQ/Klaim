// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IPILicenseTemplate } from "@storyprotocol/core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILTerms } from "@storyprotocol/core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "@storyprotocol/core/contracts/lib/PILFlavors.sol";

/**
 * @title LicenseTermsManager
 * @notice Manages PIL license terms registration and retrieval
 */
contract LicenseTermsManager {
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable MERC20;

    event LicenseTermsRegistered(uint256 indexed licenseTermsId, address indexed registrar);

    constructor(address _pilTemplate, address _royaltyPolicyLAP, address _merc20) {
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
        ROYALTY_POLICY_LAP = _royaltyPolicyLAP;
        MERC20 = _merc20;
    }

    /**
     * @notice Registers commercial remix license terms
     * @param mintingFee Fee for minting licenses
     * @param commercialRevShare Revenue share percentage (in basis points)
     * @return licenseTermsId The registered license terms ID
     */
    function registerCommercialRemixTerms(
        uint256 mintingFee,
        uint32 commercialRevShare
    ) external returns (uint256 licenseTermsId) {
        PILTerms memory pilTerms = PILFlavors.commercialRemix({
            mintingFee: mintingFee,
            commercialRevShare: commercialRevShare,
            royaltyPolicy: ROYALTY_POLICY_LAP,
            currencyToken: MERC20
        });
        
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(pilTerms);
        emit LicenseTermsRegistered(licenseTermsId, msg.sender);
    }

    /**
     * @notice Registers commercial use license terms
     * @param mintingFee Fee for minting licenses
     * @return licenseTermsId The registered license terms ID
     */
    function registerCommercialUseTerms(uint256 mintingFee) external returns (uint256 licenseTermsId) {
        PILTerms memory pilTerms = PILFlavors.commercialUse({
            mintingFee: mintingFee,
            royaltyPolicy: ROYALTY_POLICY_LAP,
            currencyToken: MERC20
        });
        
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(pilTerms);
        emit LicenseTermsRegistered(licenseTermsId, msg.sender);
    }

    /**
     * @notice Registers custom PIL terms
     * @param pilTerms Custom PIL terms structure
     * @return licenseTermsId The registered license terms ID
     */
    function registerCustomTerms(PILTerms memory pilTerms) external returns (uint256 licenseTermsId) {
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(pilTerms);
        emit LicenseTermsRegistered(licenseTermsId, msg.sender);
    }

    /**
     * @notice Gets license terms ID for given PIL terms
     * @param pilTerms PIL terms to get ID for
     * @return licenseTermsId The license terms ID
     */
    function getLicenseTermsId(PILTerms memory pilTerms) external view returns (uint256 licenseTermsId) {
        return PIL_TEMPLATE.getLicenseTermsId(pilTerms);
    }
}