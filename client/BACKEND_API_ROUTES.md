# Backend API Routes Documentation

Base URL: `https://klaim.onrender.com`

## Authentication Routes

### Get Nonce
**GET** `/auth/nonce/:wallet`

Generates a nonce for wallet authentication. Also creates user if doesn't exist.

**Note:** Currently, the nonce is generated but not stored/verified. The actual login uses a static message.

**Parameters:**
- `wallet` (path) - Ethereum wallet address (0x format)

**Response:**
```json
{
  "nonce": "string"
}
```

**Errors:**
- `400` - Invalid Ethereum wallet address format
- `503` - Failed to generate nonce

---

### Login
**POST** `/auth/login`

Authenticates a user with wallet signature.

**Important:** The message to sign must be exactly: `"Welcome to Klaimit! Sign this message to login."`

**Request Body:**
```json
{
  "wallet": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "access_token": "string"
}
```

**Authentication Flow:**
1. User signs the exact message: `"Welcome to Klaimit! Sign this message to login."`
2. Send wallet address and signature to `/auth/login`
3. Backend verifies signature matches wallet address
4. Returns JWT access token

**Errors:**
- `401` - Unauthorized (invalid signature or user not found)
- `500` - Authentication process failed

---

## User Routes

### Get User Profile
**GET** `/users/:id`

Retrieves user profile by ID.

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "walletAddress": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### Sync Wallet
**POST** `/users/sync-wallet`

Syncs a wallet address with the user account.

**Request Body:**
```json
{
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet synced successfully"
}
```

---

### Sign Up
**POST** `/users/signup`

Creates a new user account.

**Request Body:**
```json
{
  "username": "string",
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "string",
    "username": "string",
    "walletAddress": "string"
  }
}
```

**Errors:**
- `500` - User already exists

---

### Login (Legacy)
**POST** `/users/login`

Legacy login endpoint (use `/auth/login` instead).

**Request Body:**
```json
{
  "username": "string",
  "walletAddress": "0x..."
}
```

---

## Asset Routes

### Create NFT
**POST** `/assets/nft`

Creates a new NFT asset.

**Request Body:**
```json
{
  "nft_info": {
    "name": "string",
    "description": "string (optional)",
    "image_url": "string"
  },
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "image_url": "string",
  "creator": "string",
  "owner": "string",
  "createdAt": "date"
}
```

---

### Create IP
**POST** `/assets/ip`

Creates a new Intellectual Property asset.

**Request Body:**
```json
{
  "ip_info": {
    "title": "string",
    "description": "string (optional)",
    "creators": "string",
    "createdat": "string"
  },
  "nftId": "string (optional)"
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "creators": "string",
  "nftId": "string",
  "createdAt": "date"
}
```

---

### Update Blockchain Data
**PATCH** `/assets/:id/blockchain`

Updates blockchain-related data for an asset.

**Parameters:**
- `id` (path) - Asset ID

**Request Body:**
```json
{
  "nftId": "string (optional)",
  "ipId": "string (optional)",
  "tokenId": "number (optional)",
  "transactionHash": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "asset": { /* updated asset */ }
}
```

---

### List on Marketplace
**POST** `/assets/marketplace/list`

Lists an asset on the marketplace.

**Request Body:**
```json
{
  "assetId": "string",
  "nftContract": "string (optional)",
  "tokenId": "number (optional)",
  "price": "number",
  "seller": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "_id": "string",
    "assetId": "string",
    "price": "number",
    "seller": "string",
    "status": "active"
  }
}
```

---

### Purchase IP
**POST** `/assets/marketplace/purchase`

Purchases an IP from the marketplace.

**Request Body:**
```json
{
  "listingId": "string",
  "buyer": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* transaction details */ }
}
```

---

### Get Marketplace Listings
**GET** `/assets/marketplace`

Retrieves all active marketplace listings.

**Response:**
```json
[
  {
    "_id": "string",
    "assetId": "string",
    "price": "number",
    "seller": "string",
    "status": "active",
    "asset": { /* asset details */ }
  }
]
```

---

### Get User's IPs
**GET** `/assets/user/:walletAddress`

Retrieves all assets owned by a specific wallet address.

**Parameters:**
- `walletAddress` (path) - Ethereum wallet address

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "owner": "string",
    /* other asset fields */
  }
]
```

---

### Get All Assets
**GET** `/assets`

Retrieves all assets in the system.

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "owner": "string",
    /* other asset fields */
  }
]
```

---

### Get Asset by ID
**GET** `/assets/:id`

Retrieves a specific asset by ID.

**Parameters:**
- `id` (path) - Asset ID

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "owner": "string",
  /* other asset fields */
}
```

---

### Transfer Asset
**POST** `/assets/transfer`

Transfers asset ownership between addresses.

**Request Body:**
```json
{
  "assetId": "string",
  "fromAddress": "0x...",
  "toAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "asset": { /* updated asset */ }
}
```

---

## Faucet Routes

### Claim Tokens
**POST** `/faucet/claim`

Claims test tokens from the faucet (rate limited: 1 request per minute).

**Request Body:**
```json
{
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "amount": "string",
  "message": "Tokens claimed successfully"
}
```

**Errors:**
- `400` - Invalid wallet address or already claimed
- `429` - Too many requests (rate limit exceeded)
- `500` - Internal server error

---

### Check Eligibility
**GET** `/faucet/eligibility/:address`

Checks if a wallet address is eligible to claim tokens.

**Parameters:**
- `address` (path) - Ethereum wallet address

**Response:**
```json
{
  "eligible": true,
  "hasClaimed": false
}
```

**Errors:**
- `500` - Failed to check eligibility

---

### Get Token Balance
**GET** `/faucet/balance/:address`

Retrieves the KIP token balance for a wallet address.

**Parameters:**
- `address` (path) - Ethereum wallet address

**Response:**
```json
{
  "balance": "string",
  "address": "0x..."
}
```

**Errors:**
- `400` - Invalid wallet address
- `500` - Failed to query token balance

---

## Server Health & Testing Routes

### Comprehensive Server Ping
The system includes comprehensive server health checking that tests multiple critical endpoints:

**Tested Routes:**
- `/assets` - Core asset management API
- `/auth/nonce/0x0000000000000000000000000000000000000000` - Authentication system
- `/users/test` - User management (404 expected but shows server is up)
- `/faucet/balance/0x0000000000000000000000000000000000000000` - Token faucet system
- `/assets/marketplace` - Marketplace functionality

**Manual Testing:**
- Available via navbar "Test Server" button
- Console functions: `window.testServer()`, `window.testRoute('/path')`, `window.testQuick()`

**Response Format:**
```json
{
  "success": true,
  "status": "online|partial|offline",
  "responseTime": 1234,
  "routes": {
    "Assets API": {
      "success": true,
      "statusCode": 200,
      "responseTime": 123,
      "critical": true
    }
  },
  "errors": [],
  "warnings": []
}
```

---

## Error Response Format

All endpoints return errors in the following format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Authentication

Most protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The token is obtained from the `/auth/login` endpoint after successful wallet signature verification.

## CORS Configuration

The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- Custom frontend URL (via `FRONTEND_URL` environment variable)

Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## Validation

All request bodies are validated using class-validator. Invalid requests will return a `400 Bad Request` with details about validation errors.
