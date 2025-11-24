# 🚰 Token Faucet - Complete Integration

A fully integrated token faucet system for the Klaim marketplace, allowing users to claim 2000 KIP tokens once per wallet.

## 🎯 Quick Start

### 1. Install Dependencies
```bash
pnpm install:all
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
MONGODB_URI=mongodb://localhost:27017/klaim
JWT_SECRET=your_secret_here
```

**Client** (`client/.env`):
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
```

### 3. Start Services

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
pnpm start:server

# Terminal 3: Start Frontend
pnpm start:client
```

### 4. Test Integration

```bash
pnpm test:integration
```

## 📚 Documentation

- **[Setup Guide](FAUCET_SETUP_GUIDE.md)** - Complete setup instructions
- **[Integration Checklist](INTEGRATION_CHECKLIST.md)** - Verification steps
- **[Integration Summary](INTEGRATION_SUMMARY.md)** - Technical overview

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│   Backend    │─────▶│   Contract   │
│   Next.js    │      │   NestJS     │      │   IPToken    │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     │                      │
   TokenFaucet          FaucetService          mint(address)
   Component                 │                      │
                        MongoDB              Story Testnet
                      (Claims DB)           (Blockchain)
```

## ✨ Features

- ✅ One-time token claim per wallet
- ✅ Real-time balance display
- ✅ Automatic eligibility checking
- ✅ Transaction tracking
- ✅ Rate limiting protection
- ✅ Comprehensive error handling
- ✅ Mobile-responsive UI

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/faucet/claim` | Claim 2000 KIP tokens |
| GET | `/faucet/eligibility/:address` | Check if address can claim |
| GET | `/faucet/balance/:address` | Get KIP token balance |

## 🧪 Testing

```bash
# Run full integration test
pnpm test:integration

# Test contract balance query
pnpm test:balance

# Test eligibility endpoint
pnpm test:eligibility
```

## 📦 Components

### Backend
- `FaucetService` - Core claim logic
- `FaucetController` - REST API
- `Web3Service` - Blockchain integration
- `FaucetClaim` - MongoDB schema

### Frontend
- `TokenFaucet` - React component
- `api.js` - API client functions

## 🔐 Security

- Private key stored in environment variables
- Rate limiting (1 req/min per IP)
- Address validation
- Duplicate claim prevention
- CORS protection

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Deployer private key not configured" | Set `DEPLOYER_PRIVATE_KEY` in `server/.env` |
| "Insufficient gas" | Fund deployer wallet with testnet tokens |
| "Already claimed" | Expected - each wallet can only claim once |
| "MongoDB connection failed" | Ensure MongoDB is running |

## 📊 Requirements Coverage

All requirements from the spec are implemented:

- ✅ User can claim 2000 KIP tokens
- ✅ Claim component removes after success
- ✅ Duplicate claims are prevented
- ✅ Balance updates in real-time
- ✅ Error handling for all scenarios
- ✅ Database tracking of claims

## 🚀 Production Deployment

Before deploying to production:

1. Set production environment variables
2. Use strong JWT secret
3. Configure production MongoDB
4. Ensure deployer wallet is funded
5. Update CORS origins
6. Set up monitoring

## 📈 Monitoring

Track these metrics in production:

- Total claims processed
- Failed claim attempts
- Average transaction time
- Gas costs per claim
- Database size growth

## 🤝 Contributing

The integration follows the spec-driven development workflow:

1. Requirements defined in `.kiro/specs/token-faucet/requirements.md`
2. Design documented in `.kiro/specs/token-faucet/design.md`
3. Tasks tracked in `.kiro/specs/token-faucet/tasks.md`

## 📝 License

MIT

## 🎉 Status

**Integration Status:** ✅ COMPLETE

All core functionality implemented and tested. Ready for deployment after environment configuration.

---

**Need Help?** Check the [Setup Guide](FAUCET_SETUP_GUIDE.md) or [Integration Checklist](INTEGRATION_CHECKLIST.md)
