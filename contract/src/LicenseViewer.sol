// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { ILicenseRegistry } from "@storyprotocol/core/interfaces/registries/ILicenseRegistry.sol";
import { IPILicenseTemplate } from "@storyprotocol/core/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILTerms } from "@storyprotocol/core/interfaces/modules/licensing/IPILicenseTemplate.sol";

/**
 * @title LicenseViewer
 * @notice Views and retrieves license information for IP Assets
 */
contract LicenseViewer {
    ILicenseRegistry public immutable LICENSE_REGISTRY;
    IPILicenseTemplate public immutable PIL_TEMPLATE;

    constructor(address _licenseRegistry, address _pilTemplate) {
        LICENSE_REGISTRY = ILicenseRegistry(_licenseRegistry);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
    }

    /**
     * @notice Gets all license terms attached to an IP Asset
     * @param ipId The IP Asset address (from frontend/backend)
     * @return licenseData Array of license information
     */
    function getIPLicenses(address ipId) external view returns (LicenseData[] memory licenseData) {
        uint256 count = LICENSE_REGISTRY.getAttachedLicenseTermsCount(ipId);
        licenseData = new LicenseData[](count);
        
        for (uint256 i = 0; i < count; i++) {
            (address licenseTemplate, uint256 licenseTermsId) = LICENSE_REGISTRY.getAttachedLicenseTerms(ipId, i);
            
            if (licenseTemplate == address(PIL_TEMPLATE)) {
                PILTerms memory terms = PIL_TEMPLATE.getLicenseTerms(licenseTermsId);
                
                licenseData[i] = LicenseData({
                    licenseTemplate: licenseTemplate,
                    licenseTermsId: licenseTermsId,
                    licenseURI: terms.uri,                    // Viewable license text URL
                    commercialUse: terms.commercialUse,
                    derivativesAllowed: terms.derivativesAllowed,
                    commercialRevShare: terms.commercialRevShare,
                    mintingFee: terms.defaultMintingFee,
                    currency: terms.currency
                });
            }
        }
    }

    /**
     * @notice Gets readable license terms for an IP Asset
     * @param ipId The IP Asset address
     * @param index License index (0 for first license)
     * @return licenseURI URL to full license text (IPFS/web)
     * @return summary Human-readable license summary
     */
    function getLicenseText(address ipId, uint256 index) external view returns (string memory licenseURI, string memory summary) {
        (address licenseTemplate, uint256 licenseTermsId) = LICENSE_REGISTRY.getAttachedLicenseTerms(ipId, index);
        
        if (licenseTemplate == address(PIL_TEMPLATE)) {
            PILTerms memory terms = PIL_TEMPLATE.getLicenseTerms(licenseTermsId);
            licenseURI = terms.uri;
            
            // Generate human-readable summary
            if (terms.commercialUse && terms.derivativesAllowed) {
                summary = string(abi.encodePacked(
                    "Commercial Remix License - ",
                    "Commercial use: YES, ",
                    "Derivatives: YES, ",
                    "Revenue share: ", _uint2str(terms.commercialRevShare / 10**6), "%"
                ));
            } else if (terms.commercialUse) {
                summary = "Commercial Use License - Commercial use allowed, no derivatives";
            } else {
                summary = "Non-Commercial License - Personal use only";
            }
        }
    }

    /**
     * @notice Checks if an IP Asset has specific license permissions
     * @param ipId The IP Asset address
     * @return permissions License permissions summary
     */
    function getLicensePermissions(address ipId) external view returns (LicensePermissions memory permissions) {
        uint256 count = LICENSE_REGISTRY.getAttachedLicenseTermsCount(ipId);
        
        for (uint256 i = 0; i < count; i++) {
            (address licenseTemplate, uint256 licenseTermsId) = LICENSE_REGISTRY.getAttachedLicenseTerms(ipId, i);
            
            if (licenseTemplate == address(PIL_TEMPLATE)) {
                PILTerms memory terms = PIL_TEMPLATE.getLicenseTerms(licenseTermsId);
                
                // Aggregate permissions (OR logic - if any license allows, it's allowed)
                permissions.commercialUse = permissions.commercialUse || terms.commercialUse;
                permissions.derivativesAllowed = permissions.derivativesAllowed || terms.derivativesAllowed;
                permissions.hasLicense = true;
                
                if (terms.commercialRevShare > permissions.minRevShare) {
                    permissions.minRevShare = terms.commercialRevShare;
                }
            }
        }
    }

    // Helper function to convert uint to string
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}

// Structs for returning license data
struct LicenseData {
    address licenseTemplate;
    uint256 licenseTermsId;
    string licenseURI;          // URL to full license text
    bool commercialUse;
    bool derivativesAllowed;
    uint32 commercialRevShare;
    uint256 mintingFee;
    address currency;
}

struct LicensePermissions {
    bool hasLicense;
    bool commercialUse;
    bool derivativesAllowed;
    uint32 minRevShare;
}