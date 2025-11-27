# Installing Dependencies

The package.json has been updated with all required dependencies. To install them, run:

```bash
cd mobile
pnpm install
```

## Core Dependencies Added

### Blockchain & Wallet
- `ethers@^6.15.0` - Ethereum library for blockchain interactions
- `@walletconnect/react-native-compat@^2.17.2` - WalletConnect v2 for mobile wallet integration
- `@walletconnect/modal-react-native@^1.1.0` - WalletConnect modal UI

### Storage & Data
- `@react-native-async-storage/async-storage@^2.1.0` - Async storage for caching
- `expo-secure-store@~14.0.0` - Secure storage for sensitive data
- `expo-file-system@~18.0.7` - File system access

### Media & Camera
- `expo-camera@~16.0.10` - Camera access for capturing images
- `expo-image-picker@~16.0.5` - Image picker for selecting photos

### Authentication & Security
- `expo-local-authentication@~15.0.1` - Biometric authentication (Face ID/Touch ID)
- `expo-crypto@~14.0.1` - Cryptographic functions

### UI & UX
- `expo-haptics@~14.0.0` - Haptic feedback
- `react-native-svg@^15.9.0` - SVG support for icons

### Networking
- `axios@^1.7.9` - HTTP client for API calls

## Post-Installation

After installing dependencies, you may need to:

1. Clear the Metro bundler cache:
```bash
pnpm reset
```

2. Rebuild the app:
```bash
pnpm start
```

## Platform-Specific Setup

### iOS
Some dependencies require CocoaPods. If you're building for iOS:
```bash
cd ios
pod install
cd ..
```

### Android
No additional setup required for Android.

## Troubleshooting

If you encounter issues:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules
pnpm install
```

2. Clear Expo cache:
```bash
expo start --clear
```

3. Check Expo SDK compatibility:
```bash
npx expo-doctor
```
