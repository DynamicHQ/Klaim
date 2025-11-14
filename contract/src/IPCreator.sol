// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IIPAssetRegistry } from "@storyprotocol/core/interfaces/registries/IIPAssetRegistry.sol";
import { ILicensingModule } from "@storyprotocol/core/interfaces/modules/licensing/ILicensingModule.sol";
import { IPILicenseTemplate } from "@storyprotocol/core/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "@storyprotocol/core/lib/PILFlavors.sol";
import { PILTerms } from "@storyprotocol/core/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import { SimpleNFT } from "./mocks/SimpleNFT.sol";

/**
 * @title IPCreator
 * @notice Auto-creates NFT + IP Asset with "Commercial Use Only" licenses for one-off marketplace
 */
contract IPCreator is ERC721Holder {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable MERC20;
    
    SimpleNFT public immutable NFT_CONTRACT;

    event IPAssetCreated(
        address indexed ipId, 
        uint256 indexed tokenId, 
        address indexed owner,
        string metadataURI,
        uint256 licenseTermsId
    );

    constructor(
        address _ipAssetRegistry,    // From Story Protocol deployment
        address _licensingModule,    // From Story Protocol deployment  
        address _pilTemplate,        // From Story Protocol deployment
        address _royaltyPolicyLAP,   // From Story Protocol deployment
        address _merc20              // From Story Protocol deployment
    ) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
        ROYALTY_POLICY_LAP = _royaltyPolicyLAP;
        MERC20 = _merc20;
        
        NFT_CONTRACT = new SimpleNFT("IP Creator NFTs", "IPCR");
    }

    /**
     * @notice Creates NFT + IP Asset with "Commercial Use Only" license (no derivatives/royalties)
     * @param recipient Address to receive the NFT/IP (from frontend wallet)
     * @param metadataURI IPFS URI of uploaded file (from frontend IPFS upload)
     * @param metadataHash Hash of metadata (calculated by frontend)
     * @param licenseURI URI to "Commercial Use Only" license text (from frontend)
     * @return tokenId The NFT token ID
     * @return ipId The IP Asset address
     * @return licenseTermsId The license terms ID
     */
    function createIPFromFile(
        address recipient,
        string calldata metadataURI,
        bytes32 metadataHash,
        string calldata licenseURI
    ) external returns (uint256 tokenId, address ipId, uint256 licenseTermsId) {
        tokenId = NFT_CONTRACT.mint(address(this));
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(NFT_CONTRACT), tokenId);
        
        // Create "Commercial Use Only" license (no derivatives, no royalties)
        PILTerms memory terms = PILFlavors.commercialUse({
            mintingFee: 0,
            royaltyPolicy: ROYALTY_POLICY_LAP,
            currencyToken: MERC20
        });
        
        if (bytes(licenseURI).length > 0) {
            terms.uri = licenseURI; // Link to "Commercial Use Only" license text
        }
        
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(terms);
        LICENSING_MODULE.attachLicenseTerms(ipId, address(PIL_TEMPLATE), licenseTermsId);
        NFT_CONTRACT.transferFrom(address(this), recipient, tokenId);
        
        emit IPAssetCreated(ipId, tokenId, recipient, metadataURI, licenseTermsId);
    }

    /**
     * @notice Batch create multiple IP Assets with "Commercial Use Only" licenses
     * @param recipients Array of recipient addresses (from frontend)
     * @param metadataURIs Array of IPFS URIs (from frontend batch upload)
     * @param metadataHashes Array of metadata hashes (calculated by frontend)
     * @param licenseURI URI to shared "Commercial Use Only" license text
     * @return tokenIds Array of NFT token IDs
     * @return ipIds Array of IP Asset addresses
     * @return licenseTermsId Shared license terms ID
     */
    function batchCreateIPs(
        address[] calldata recipients,
        string[] calldata metadataURIs,
        bytes32[] calldata metadataHashes,
        string calldata licenseURI
    ) external returns (uint256[] memory tokenIds, address[] memory ipIds, uint256 licenseTermsId) {
        require(recipients.length == metadataURIs.length, "Array length mismatch");
        
        tokenIds = new uint256[](recipients.length);
        ipIds = new address[](recipients.length);
        
        // Create "Commercial Use Only" license for all IPs
        PILTerms memory terms = PILFlavors.commercialUse({
            mintingFee: 0,
            royaltyPolicy: ROYALTY_POLICY_LAP,
            currencyToken: MERC20
        });
        
        if (bytes(licenseURI).length > 0) {
            terms.uri = licenseURI;
        }
        
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(terms);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = NFT_CONTRACT.mint(address(this));
            ipIds[i] = IP_ASSET_REGISTRY.register(block.chainid, address(NFT_CONTRACT), tokenIds[i]);
            
            LICENSING_MODULE.attachLicenseTerms(ipIds[i], address(PIL_TEMPLATE), licenseTermsId);
            NFT_CONTRACT.transferFrom(address(this), recipients[i], tokenIds[i]);
            
            emit IPAssetCreated(ipIds[i], tokenIds[i], recipients[i], metadataURIs[i], licenseTermsId);
        }
    }

    function getNFTContract() external view returns (address nftContract) {
        return address(NFT_CONTRACT);
    }
}