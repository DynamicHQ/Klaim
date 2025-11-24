// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { ILicensingModule } from "@storyprotocol/core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { ILicenseToken } from "@storyprotocol/core/contracts/interfaces/ILicenseToken.sol";
import { IPILicenseTemplate } from "@storyprotocol/core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";

/**
 * @title LicenseTokenManager
 * @notice Manages minting and handling of license tokens
 */
contract LicenseTokenManager {
    ILicensingModule public immutable LICENSING_MODULE;
    ILicenseToken public immutable LICENSE_TOKEN;
    IPILicenseTemplate public immutable PIL_TEMPLATE;

    event LicenseTokensMinted(
        address indexed licensorIpId,
        uint256 indexed licenseTermsId,
        uint256 startTokenId,
        uint256 amount,
        address indexed receiver
    );

    constructor(address _licensingModule, address _licenseToken, address _pilTemplate) {
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        LICENSE_TOKEN = ILicenseToken(_licenseToken);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
    }

    /**
     * @notice Mints license tokens for an IP Asset
     * @param licensorIpId The IP Asset issuing the license
     * @param licenseTermsId The license terms ID
     * @param amount Number of license tokens to mint
     * @param receiver Address to receive the license tokens
     * @param maxMintingFee Maximum minting fee willing to pay
     * @param maxRevenueShare Maximum revenue share willing to accept
     * @return startLicenseTokenId The starting ID of minted license tokens
     */
    function mintLicenseTokens(
        address licensorIpId,
        uint256 licenseTermsId,
        uint256 amount,
        address receiver,
        uint256 maxMintingFee,
        uint32 maxRevenueShare
    ) external returns (uint256 startLicenseTokenId) {
        startLicenseTokenId = LICENSING_MODULE.mintLicenseTokens({
            licensorIpId: licensorIpId,
            licenseTemplate: address(PIL_TEMPLATE),
            licenseTermsId: licenseTermsId,
            amount: amount,
            receiver: receiver,
            royaltyContext: "", // for PIL, royaltyContext is empty string
            maxMintingFee: maxMintingFee,
            maxRevenueShare: maxRevenueShare
        });

        emit LicenseTokensMinted(licensorIpId, licenseTermsId, startLicenseTokenId, amount, receiver);
    }

    /**
     * @notice Gets the owner of a license token
     * @param tokenId The license token ID
     * @return owner The owner address
     */
    function ownerOf(uint256 tokenId) external view returns (address owner) {
        return LICENSE_TOKEN.ownerOf(tokenId);
    }

    /**
     * @notice Checks if an address owns a specific license token
     * @param tokenId The license token ID
     * @param account The address to check
     * @return isOwner True if the account owns the token
     */
    function isTokenOwner(uint256 tokenId, address account) external view returns (bool isOwner) {
        return LICENSE_TOKEN.ownerOf(tokenId) == account;
    }
}