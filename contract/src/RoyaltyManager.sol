// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import { IRoyaltyModule } from "@storyprotocol/core/contracts/interfaces/modules/royalty/IRoyaltyModule.sol";
import { IRoyaltyWorkflows } from "@storyprotocol/periphery/contracts/interfaces/workflows/IRoyaltyWorkflows.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RoyaltyManager
 * @notice Manages royalty payments and revenue claiming for IP Assets
 */
contract RoyaltyManager {
    IRoyaltyModule public immutable ROYALTY_MODULE;
    IRoyaltyWorkflows public immutable ROYALTY_WORKFLOWS;
    address public immutable ROYALTY_POLICY_LAP;

    event RoyaltyPaid(address indexed ipId, address indexed token, uint256 amount);
    event RevenueClaimed(address indexed ancestorIpId, address indexed claimer, uint256[] amounts);

    constructor(address _royaltyModule, address _royaltyWorkflows, address _royaltyPolicyLAP) {
        ROYALTY_MODULE = IRoyaltyModule(_royaltyModule);
        ROYALTY_WORKFLOWS = IRoyaltyWorkflows(_royaltyWorkflows);
        ROYALTY_POLICY_LAP = _royaltyPolicyLAP;
    }

    /**
     * @notice Pays royalty to an IP Asset on behalf of a payer
     * @param ipId The IP Asset to pay royalty to
     * @param token The ERC20 token to pay with
     * @param amount The amount to pay
     */
    function payRoyalty(address ipId, address token, uint256 amount) external {
        // Approve the royalty module to spend tokens
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        IERC20(token).approve(address(ROYALTY_MODULE), amount);
        
        ROYALTY_MODULE.payRoyaltyOnBehalf(ipId, address(0), token, amount);
        emit RoyaltyPaid(ipId, token, amount);
    }

    /**
     * @notice Claims all revenue for an ancestor IP from its derivatives
     * @param ancestorIpId The ancestor IP Asset
     * @param claimer The address claiming the revenue (usually the IP Asset itself)
     * @param childIpIds Array of child IP Asset addresses
     * @param currencyTokens Array of currency token addresses
     * @return amountsClaimed Array of amounts claimed for each currency
     */
    function claimAllRevenue(
        address ancestorIpId,
        address claimer,
        address[] calldata childIpIds,
        address[] calldata currencyTokens
    ) external returns (uint256[] memory amountsClaimed) {
        address[] memory royaltyPolicies = new address[](childIpIds.length);
        
        // Fill royalty policies array (assuming all use LAP policy)
        for (uint256 i = 0; i < childIpIds.length; i++) {
            royaltyPolicies[i] = ROYALTY_POLICY_LAP;
        }

        amountsClaimed = ROYALTY_WORKFLOWS.claimAllRevenue({
            ancestorIpId: ancestorIpId,
            claimer: claimer,
            childIpIds: childIpIds,
            royaltyPolicies: royaltyPolicies,
            currencyTokens: currencyTokens
        });

        emit RevenueClaimed(ancestorIpId, claimer, amountsClaimed);
    }

    /**
     * @notice Gets the royalty vault address for an IP Asset
     * @param ipId The IP Asset
     * @return vault The royalty vault address
     */
    function getIpRoyaltyVault(address ipId) external view returns (address vault) {
        return ROYALTY_MODULE.ipRoyaltyVaults(ipId);
    }

    /**
     * @notice Helper function to approve token spending for royalty payments
     * @param token The ERC20 token address
     * @param amount The amount to approve
     */
    function approveRoyaltyModule(address token, uint256 amount) external {
        IERC20(token).approve(address(ROYALTY_MODULE), amount);
    }
}