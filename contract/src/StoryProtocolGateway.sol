// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IIPAssetRegistry } from "@storyprotocol/core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import { ILicensingModule } from "@storyprotocol/core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { IPILicenseTemplate } from "@storyprotocol/core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "@storyprotocol/core/contracts/lib/PILFlavors.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import { SimpleNFT } from "./mocks/SimpleNFT.sol";

/**
 * @title StoryProtocolGateway
 * @notice A comprehensive gateway contract that combines all Story Protocol operations
 * @dev This contract demonstrates the complete workflow from NFT minting to derivative creation
 */
contract StoryProtocolGateway is ERC721Holder {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable MERC20;

    SimpleNFT public immutable SIMPLE_NFT;

    event IPAssetCreated(address indexed ipId, uint256 indexed tokenId, address indexed owner);
    event LicenseTermsAttached(address indexed ipId, uint256 indexed licenseTermsId);
    event DerivativeCreated(address indexed childIpId, address indexed parentIpId, uint256[] licenseTokenIds);

    constructor(
        address _ipAssetRegistry,
        address _licensingModule,
        address _pilTemplate,
        address _royaltyPolicyLAP,
        address _merc20,
        string memory _nftName,
        string memory _nftSymbol
    ) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
        ROYALTY_POLICY_LAP = _royaltyPolicyLAP;
        MERC20 = _merc20;
        
        SIMPLE_NFT = new SimpleNFT(_nftName, _nftSymbol);
    }

    /**
     * @notice Complete workflow: mint NFT, register as IP, create and attach license terms
     * @param receiver The address to receive the NFT and IP Asset
     * @param commercialRevShare Revenue share percentage for commercial use
     * @return tokenId The minted NFT token ID
     * @return ipId The registered IP Asset address
     * @return licenseTermsId The created license terms ID
     */
    function createIPAssetWithLicense(
        address receiver,
        uint32 commercialRevShare
    ) external returns (uint256 tokenId, address ipId, uint256 licenseTermsId) {
        // Mint NFT to this contract temporarily
        tokenId = SIMPLE_NFT.mint(address(this));
        
        // Register as IP Asset
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenId);
        
        // Create commercial remix license terms
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(
            PILFlavors.commercialRemix({
                mintingFee: 0,
                commercialRevShare: commercialRevShare,
                royaltyPolicy: ROYALTY_POLICY_LAP,
                currencyToken: MERC20
            })
        );
        
        // Attach license terms to IP Asset
        LICENSING_MODULE.attachLicenseTerms(ipId, address(PIL_TEMPLATE), licenseTermsId);
        
        // Transfer NFT to receiver
        SIMPLE_NFT.transferFrom(address(this), receiver, tokenId);
        
        emit IPAssetCreated(ipId, tokenId, receiver);
        emit LicenseTermsAttached(ipId, licenseTermsId);
    }

    /**
     * @notice Creates a derivative IP Asset from a parent using license tokens
     * @param parentIpId The parent IP Asset address
     * @param licenseTermsId The license terms ID to mint tokens from
     * @param receiver The address to receive the derivative NFT and IP Asset
     * @return childTokenId The derivative NFT token ID
     * @return childIpId The derivative IP Asset address
     */
    function createDerivativeIP(
        address parentIpId,
        uint256 licenseTermsId,
        address receiver
    ) external returns (uint256 childTokenId, address childIpId) {
        // Mint NFT for derivative
        childTokenId = SIMPLE_NFT.mint(address(this));
        
        // Register derivative as IP Asset
        childIpId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), childTokenId);
        
        // Mint license token from parent
        uint256 licenseTokenId = LICENSING_MODULE.mintLicenseTokens({
            licensorIpId: parentIpId,
            licenseTemplate: address(PIL_TEMPLATE),
            licenseTermsId: licenseTermsId,
            amount: 1,
            receiver: address(this),
            royaltyContext: "",
            maxMintingFee: 0,
            maxRevenueShare: 0
        });
        
        // Register as derivative using license token
        uint256[] memory licenseTokenIds = new uint256[](1);
        licenseTokenIds[0] = licenseTokenId;
        
        LICENSING_MODULE.registerDerivativeWithLicenseTokens({
            childIpId: childIpId,
            licenseTokenIds: licenseTokenIds,
            royaltyContext: "",
            maxRts: 0
        });
        
        // Transfer NFT to receiver
        SIMPLE_NFT.transferFrom(address(this), receiver, childTokenId);
        
        emit DerivativeCreated(childIpId, parentIpId, licenseTokenIds);
    }

    /**
     * @notice Batch creates multiple IP Assets with the same license terms
     * @param receivers Array of addresses to receive the NFTs and IP Assets
     * @param commercialRevShare Revenue share percentage for all IP Assets
     * @return tokenIds Array of minted NFT token IDs
     * @return ipIds Array of registered IP Asset addresses
     * @return licenseTermsId The shared license terms ID
     */
    function batchCreateIPAssets(
        address[] calldata receivers,
        uint32 commercialRevShare
    ) external returns (uint256[] memory tokenIds, address[] memory ipIds, uint256 licenseTermsId) {
        require(receivers.length > 0, "Empty receivers array");
        
        tokenIds = new uint256[](receivers.length);
        ipIds = new address[](receivers.length);
        
        // Create license terms once for all IP Assets
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(
            PILFlavors.commercialRemix({
                mintingFee: 0,
                commercialRevShare: commercialRevShare,
                royaltyPolicy: ROYALTY_POLICY_LAP,
                currencyToken: MERC20
            })
        );
        
        // Create IP Assets for each receiver
        for (uint256 i = 0; i < receivers.length; i++) {
            tokenIds[i] = SIMPLE_NFT.mint(address(this));
            ipIds[i] = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenIds[i]);
            
            LICENSING_MODULE.attachLicenseTerms(ipIds[i], address(PIL_TEMPLATE), licenseTermsId);
            SIMPLE_NFT.transferFrom(address(this), receivers[i], tokenIds[i]);
            
            emit IPAssetCreated(ipIds[i], tokenIds[i], receivers[i]);
            emit LicenseTermsAttached(ipIds[i], licenseTermsId);
        }
    }
}