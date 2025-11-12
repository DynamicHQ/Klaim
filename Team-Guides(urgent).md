# 🤝 Klaim Team Guide

Welcome to the Klaim IP Marketplace project! This guide outlines responsibilities, workflows, and integration checkpoints for each team member. It’s designed to help us move fast, stay aligned, and ship a working MVP for the hackathon.

---

## 👨‍💻 Smart Contract Engineer

### 🔧 Responsibilities
- Design and implement Solidity contracts for:
  - IP asset minting (ERC-721 or ERC-1155)
  - IP token payments (ERC-20 or custom)
  - Trade logic and fee distribution
  - Licensing and Story Protocol hooks
- Write and run tests using Hardhat
- Deploy contracts to Sepolia testnet
- Export ABI and contract addresses for frontend/backend

### 📁 Folder Structure
/backend 
 └── src/ 
 └── auth/ 
 └── assets/
 └── trade/
 └── story/
 └── common/
 └── prisma/ or mongoose/

 
### 🧪 Testing
- Unit tests for services and controllers
- Integration tests for API endpoints
- Swagger or Postman collection for frontend testing

### 📤 Deployment
- Use Railway or Render for staging
- Environment variables for RPC, DB, and Story Protocol keys

### ✅ Integration Checkpoints
- API contract documented in `/shared/api-spec.md`
- MongoDB schema aligned with asset and trade models
- Event listener working and syncing with DB

---

## 🔗 Shared Responsibilities

### 🔄 Sync Points
- Agree on trade flow logic (on-chain vs off-chain)
- Define event structure for asset minting and trading
- Maintain shared config:
  - `/shared/contracts.json` → ABI + addresses
  - `/shared/api-spec.md` → endpoint shapes
  - `/shared/events.md` → emitted events and payloads

### 📅 Daily Standup Topics
- What was completed yesterday?
- What’s blocked?
- What’s next?

### 🧪 End-to-End Testing
- Mint asset → register IP → trade → verify DB update
- Frontend → backend → contract → Story Protocol

---

## 📬 Communication

- Use GitHub Issues for bugs and feature tracking
- Use Discord or WhatsApp for quick syncs
- Document decisions in `/docs/decisions.md`

---

Let’s build something amazing. Klaim it!
