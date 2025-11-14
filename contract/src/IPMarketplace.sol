// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IIPAssetRegistry } from "@storyprotocol/core/interfaces/registries/IIPAssetRegistry.sol";

/**
 * @title IPMarketplace
 * @notice Enables purchasing IP Assets using IP tokens and transferring ownership
 * @dev IP ownership follows NFT ownership in Story Protocol
 */
contract IPMarketplace is ReentrancyGuard {
    IERC20 public immutable IP_TOKEN;
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        address ipId;
        uint256 price;
        bool active;
    }
    
    mapping(bytes32 => Listing) public listings;
    
    event IPListed(bytes32 indexed listingId, address indexed seller, address indexed ipId, uint256 price);
    event IPSold(bytes32 indexed listingId, address indexed buyer, address indexed seller, address indexed ipId, uint256 price);
    event ListingCancelled(bytes32 indexed listingId);
    
    constructor(address _ipToken, address _ipAssetRegistry) {
        IP_TOKEN = IERC20(_ipToken);
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
    }
    
    /**
     * @notice Lists an IP Asset for sale
     * @param nftContract The NFT contract address (from frontend - user's owned NFT)
     * @param tokenId The token ID (from frontend - user's owned token)
     * @param price Price in IP tokens (from frontend - user input)
     */
    function listIP(address nftContract, uint256 tokenId, uint256 price) external {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(price > 0, "Invalid price");
        
        // Get IP ID from Story Protocol registry
        address ipId = IP_ASSET_REGISTRY.ipId(block.chainid, nftContract, tokenId);
        require(ipId != address(0), "IP not registered");
        
        // Generate unique listing ID
        bytes32 listingId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp));
        
        listings[listingId] = Listing({
            seller: msg.sender,           // From wallet connection
            nftContract: nftContract,     // From frontend user selection
            tokenId: tokenId,             // From frontend user selection
            ipId: ipId,                   // From Story Protocol registry
            price: price,                 // From frontend user input
            active: true
        });
        
        emit IPListed(listingId, msg.sender, ipId, price);
    }
    
    /**
     * @notice Purchases an IP Asset using IP tokens
     * @dev Transfers NFT ownership, which automatically transfers IP ownership
     * @param listingId The listing identifier (from frontend - user selection)
     */
    function purchaseIP(bytes32 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing inactive");
        require(IERC721(listing.nftContract).ownerOf(listing.tokenId) == listing.seller, "Seller no longer owns NFT");
        
        listing.active = false;
        
        // Transfer IP tokens from buyer to seller (requires prior approval from frontend)
        IP_TOKEN.transferFrom(msg.sender, listing.seller, listing.price);
        
        // Transfer NFT ownership (IP ownership follows automatically in Story Protocol)
        IERC721(listing.nftContract).transferFrom(listing.seller, msg.sender, listing.tokenId);
        
        emit IPSold(listingId, msg.sender, listing.seller, listing.ipId, listing.price);
    }
    
    /**
     * @notice Cancels a listing
     * @param listingId The listing identifier
     */
    function cancelListing(bytes32 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.active, "Already inactive");
        
        listing.active = false;
        emit ListingCancelled(listingId);
    }
}