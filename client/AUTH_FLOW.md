# Authentication Flow Documentation

## Overview

The Klaim application uses wallet-based authentication with signature verification. Users authenticate by signing a message with their Ethereum wallet, and the backend verifies the signature matches the wallet address.

## Authentication Flow

### Sign Up Flow

1. **Connect Wallet**
   - User clicks "Connect Wallet"
   - MetaMask prompts user to connect
   - Wallet address is stored in state

2. **Create Account**
   - User clicks "Sign Up"
   - Frontend calls `POST /users/signup` with:
     ```json
     {
       "username": "0x...", // wallet address used as username
       "walletAddress": "0x..."
     }
     ```
   - Backend creates user account
   - Automatically proceeds to login

3. **Auto Login After Signup**
   - Same as login flow below

### Login Flow

1. **Connect Wallet**
   - User clicks "Connect Wallet"
   - MetaMask prompts user to connect
   - Wallet address is stored in state

2. **Sign Message**
   - User clicks "Login with Wallet"
   - Frontend constructs the exact message: `"Welcome to Klaimit! Sign this message to login."`
   - MetaMask prompts user to sign the message
   - User approves signature

3. **Authenticate**
   - Frontend calls `POST /auth/login` with:
     ```json
     {
       "wallet": "0x...",
       "signature": "0x..."
     }
     ```
   - Backend verifies signature using `ethers.verifyMessage()`
   - Backend returns JWT access token

4. **Store Session**
   - Frontend stores JWT token in localStorage
   - Frontend stores user data in state and localStorage
   - User is redirected to home page

## Important Notes

### Message Format

The message to sign MUST be exactly:
```
Welcome to Klaimit! Sign this message to login.
```

Any deviation will cause signature verification to fail.

### Nonce Endpoint

The `/auth/nonce/:wallet` endpoint exists but is currently NOT used in the authentication flow. It generates a random nonce but doesn't store or verify it. The actual authentication uses a static message.

### Case Sensitivity

All wallet addresses are converted to lowercase on the backend for consistency.

### Token Storage

- JWT token is stored in localStorage with key `auth_token`
- User data is stored in localStorage with key `user`
- Token is sent in Authorization header: `Bearer <token>`

## Error Handling

### Common Errors

1. **User Not Found (401)**
   - Message: "User not found. Please register first."
   - Solution: User needs to sign up first

2. **Invalid Signature (401)**
   - Message: "Invalid signature."
   - Solution: Ensure message format is correct

3. **User Rejected Signature**
   - Message: "You rejected the signature request."
   - Solution: User needs to approve the signature in MetaMask

4. **User Already Exists (500)**
   - Message: "User already exists with this wallet"
   - Solution: User should login instead of signing up

## Security Considerations

### Current Implementation

- Uses static message (not ideal for production)
- No replay attack protection
- No nonce verification
- Signature is verified on backend

### Recommended Improvements

1. **Implement Nonce-Based Authentication**
   - Store nonce in database with expiration
   - Include nonce in message to sign
   - Verify nonce hasn't been used before
   - Prevents replay attacks

2. **Add Timestamp**
   - Include timestamp in message
   - Verify signature is recent
   - Prevents old signatures from being reused

3. **Rate Limiting**
   - Limit login attempts per wallet
   - Prevent brute force attacks

## Code Examples

### Frontend - Login

```javascript
const login = async () => {
  // 1. Construct message
  const message = "Welcome to Klaimit! Sign this message to login.";
  
  // 2. Sign with wallet
  const signature = await signMessage(message);
  
  // 3. Authenticate
  const { access_token } = await authenticateWithSignature(wallet, signature);
  
  // 4. Store token
  setAuthToken(access_token);
};
```

### Frontend - Signup

```javascript
const signup = async () => {
  // 1. Create user account
  await apiSignupUser(wallet, wallet);
  
  // 2. Auto login
  await login();
};
```

### Backend - Verify Signature

```typescript
const signedMessage = "Welcome to Klaimit! Sign this message to login.";
const recoveredAddress = ethers.verifyMessage(signedMessage, signature);

if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
  throw new UnauthorizedException('Invalid signature.');
}
```

## API Endpoints Used

1. **POST /users/signup** - Create new user account
2. **POST /auth/login** - Authenticate with signature
3. **GET /auth/nonce/:wallet** - Generate nonce (currently unused)

## State Management

### AuthContext State

```javascript
{
  user: {
    wallet: "0x...",
    profileName: "Klaim User"
  },
  wallet: "0x...",
  authToken: "jwt_token",
  isLoading: false,
  isAuthenticated: true
}
```

### LocalStorage

```javascript
{
  "auth_token": "jwt_token",
  "user": "{\"wallet\":\"0x...\",\"profileName\":\"Klaim User\"}",
  "connected_wallet": "0x..."
}
```
