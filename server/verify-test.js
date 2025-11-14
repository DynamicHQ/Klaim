const { ethers } = require("ethers");

// Copy your exact values:
const message = "Sign this message to log in: 35e867d3e698042ea1731321eacdd8ec";
const signature = "0xd3d51a8a5fffbd0e5eec66c4a6ae2b926f7fd8335f6bd38ca023fb7f5605a6fd636e7c534c9f05896b2aaf00db72580ec07d2dc2fbd56af9124389eab19944771c";
const walletAddress = "0x89759bbf76cb11116a85993a354c138a9935a0d1";

try {
  const recovered = ethers.verifyMessage(message, signature);
  console.log("Recovered:", recovered);
  console.log("Match?", recovered.toLowerCase() === walletAddress.toLowerCase());
} catch (err) {
  console.error("Verification failed:", err);
}
