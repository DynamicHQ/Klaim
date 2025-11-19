// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IIPAssetRegistry } from "@storyprotocol/core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import { IRegistrationWorkflows } from "@storyprotocol/periphery/contracts/interfaces/workflows/IRegistrationWorkflows.sol";
import { WorkflowStructs } from "@storyprotocol/periphery/contracts/lib/WorkflowStructs.sol";
import { ISPGNFT } from "@storyprotocol/periphery/contracts/interfaces/ISPGNFT.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IPARegistrar
 * @author Gemini Code Assist
 * @notice This contract provides wrapper functions to interact with the Story Protocol
 * for registering IP Assets. It mirrors the functionality demonstrated in the
 * `IPARegistrarTest` contract.
 */
contract IPARegistrar is Ownable {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    IRegistrationWorkflows public immutable REGISTRATION_WORKFLOWS;

    event IPRegistered(address indexed ipId, address indexed nftContract, uint256 indexed tokenId);
    event IPMintedAndRegistered(address indexed ipId, address indexed nftContract, uint256 indexed tokenId);

    /**
     * @param _ipAssetRegistry The address of the Story Protocol IPAssetRegistry.
     * @param _registrationWorkflows The address of the Story Protocol RegistrationWorkflows.
     * @param _initialOwner The initial owner of this contract.
     */
    constructor(address _ipAssetRegistry, address _registrationWorkflows, address _initialOwner) Ownable(_initialOwner) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        REGISTRATION_WORKFLOWS = IRegistrationWorkflows(_registrationWorkflows);
    }

    /**
     * @notice Registers an existing NFT as an IP Asset on Story Protocol.
     * @dev The caller must own the NFT or have approval to transfer it.
     * This function will register the IP on behalf of the NFT owner.
     * @param _nftContract The address of the NFT contract.
     * @param _tokenId The ID of the token to register.
     * @return ipId The address of the newly created IP Asset.
     */
    function register(address _nftContract, uint256 _tokenId) external returns (address ipId) {
        // The `register` function on the IIPAssetRegistry automatically assigns
        // the IP ownership to the owner of the NFT.
        ipId = IP_ASSET_REGISTRY.register(block.chainid, _nftContract, _tokenId);
        emit IPRegistered(ipId, _nftContract, _tokenId);
    }

    /**
     * @notice Mints an NFT from an SPG-compliant collection and registers it as an IP Asset.
     * @dev This contract must be the owner of the SPG NFT Collection to call this.
     * @param _spgNftContract The address of the SPG-compliant NFT contract.
     * @param _recipient The address to receive the newly minted NFT and IP Asset.
     * @param _metadata The metadata for the IP and NFT.
     * @param _bindIpToNft A flag indicating whether to bind the IP to the NFT.
     * @return ipId The address of the newly created IP Asset.
     * @return tokenId The ID of the newly minted token.
     */
    function mintAndRegisterIp(
        address _spgNftContract,
        address _recipient,
        WorkflowStructs.IPMetadata calldata _metadata,
        bool _bindIpToNft
    ) external onlyOwner returns (address ipId, uint256 tokenId) {
        // Note: The caller of `mintAndRegisterIp` on the workflow contract must be
        // the owner of the SPG NFT Collection. By making this function `onlyOwner`,
        // we ensure this contract can execute the call, assuming it was set as the
        // collection owner upon creation.
        (ipId, tokenId) = REGISTRATION_WORKFLOWS.mintAndRegisterIp(
            _spgNftContract,
            _recipient,
            _metadata,
            _bindIpToNft
        );
        emit IPMintedAndRegistered(ipId, _spgNftContract, tokenId);
    }
}