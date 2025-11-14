<!------------------------------------------------------------------------------------
   Add Rules to this file or a short description and have Kiro refine them for you:   
-------------------------------------------------------------------------------------> 

Full NFT/IP Creation Spec
You are an AI spec generator. Generate a detailed JSON/YAML spec file for a Story Foundation dApp. The dApp uses the Story Protocol (https://github.com/PIP-Labs-RE/story-protocol-boilerplate) and related docs (https://story.foundation/docs) and includes a smart contract interface that atomically mints NFTs and registers them as IPs.

Requirements for the spec:

1. Frontend:
   - The frontend triggers contract functions, including createAndRegisterIP.
   - UI states: loading, success, error.
   - Metadata submission format and validation.
   - How to display the newly minted NFT/IP and ownership info.

2. Backend:
   - API endpoints to receive frontend requests to trigger contract functions.
   - Database schema for storing NFT/IP info:
     {IP ID, NFT ID, metadataURI, creator wallet, royalties, transaction hash}.
   - Event listener setup for contract events to update DB automatically.

3. Smart Contract Interface:
   - Function signature, required parameters, return values, and emitted events.

4. Transaction Flow:
   - Atomicity of NFT creation + IP registration.
   - Error handling and recovery steps.

Output should be a structured spec file, suitable for a developer workflow.