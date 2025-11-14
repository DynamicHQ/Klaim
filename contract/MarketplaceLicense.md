# Marketplace License Model: "Commercial Use Only"

## License Type
**Commercial Use Only** - One-time purchase, full rights transfer, no derivatives, no royalties

## What This Means

### ✅ What Buyers Get:
- **Full commercial rights** to use the IP Asset
- **Complete ownership transfer** upon purchase
- **No ongoing royalties** to pay
- **Perpetual license** - never expires
- **Attribution rights** - can claim as purchased content

### ❌ What's NOT Allowed:
- **No derivatives** - cannot create modified versions
- **No sublicensing** - cannot resell licensing rights
- **No royalty sharing** - this is a one-time sale

## License Text Generated:
```
COMMERCIAL USE LICENSE

This IP Asset is licensed for COMMERCIAL USE ONLY with the following terms:

✅ Commercial Use: ALLOWED
❌ Derivatives: NOT ALLOWED  
❌ Royalties: NONE (One-time purchase)
✅ Attribution: Required
✅ Ownership Transfer: Full rights transfer upon purchase

This is a one-time purchase license. Buyer receives full commercial rights.
No ongoing royalties or derivative permissions.

Powered by Story Protocol
```

## Frontend Implementation:
```javascript
// Simplified - no revenue share input needed
const createIP = async (file) => {
  const licenseURI = await uploadCommercialUseLicense();
  
  return await ipCreator.createIPFromFile(
    userAddress,
    metadataURI, 
    metadataHash,
    licenseURI  // Only parameter needed
  );
};
```

## Perfect For:
- Stock photos/videos
- Digital art sales
- One-off content licensing
- Simple marketplace transactions
- No complex royalty tracking needed