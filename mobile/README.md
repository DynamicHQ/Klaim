# Klaim Mobile

React Native mobile application for the Klaim IP marketplace, built with Expo.

## Features

- Browse and discover IP assets on the marketplace
- Connect mobile wallet via WalletConnect
- Create and upload IP assets from your phone
- Purchase IP assets with KIP tokens
- View your profile and owned assets
- Offline support with local caching
- Biometric authentication

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for testing on physical devices)

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
   - Copy `.env` and update `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID` with your WalletConnect project ID
   - Get a project ID from https://cloud.walletconnect.com/

3. Start the development server:
```bash
pnpm start
```

## Development

### Running on Different Platforms

```bash
# iOS Simulator (macOS only)
pnpm ios

# Android Emulator
pnpm android

# Web browser
pnpm web

# Expo Go app (scan QR code)
pnpm start
```

### Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── (auth)/            # Authentication screens
│   ├── item/              # Item detail screens
│   └── _layout.js         # Root layout
├── components/            # Reusable UI components
│   ├── common/           # Generic components
│   ├── marketplace/      # Marketplace components
│   └── wallet/           # Wallet components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── config/               # Configuration files
└── assets/               # Static assets
```

### Key Technologies

- **Expo**: Development platform and toolchain
- **Expo Router**: File-based navigation
- **WalletConnect**: Mobile wallet integration
- **ethers.js**: Blockchain interactions
- **AsyncStorage**: Local data persistence
- **expo-image-picker**: Image selection
- **expo-camera**: Camera access

## Environment Variables

Required environment variables in `.env`:

```
EXPO_PUBLIC_API_ENDPOINT=https://klaim.onrender.com
EXPO_PUBLIC_PINATA_JWT=your_pinata_jwt
EXPO_PUBLIC_IP_TOKEN_ADDRESS=0x...
EXPO_PUBLIC_IP_CREATOR_ADDRESS=0x...
EXPO_PUBLIC_IP_MARKETPLACE_ADDRESS=0x...
EXPO_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Building for Production

### iOS

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

### Android

1. Build for Android:
```bash
eas build --platform android
```

## Testing

### On Physical Devices

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `pnpm start`
3. Scan the QR code with your device

### With Wallet Integration

1. Install MetaMask Mobile or another WalletConnect-compatible wallet
2. Ensure your wallet is on Story Protocol testnet
3. Test wallet connection and transactions

## Troubleshooting

### Metro bundler issues
```bash
pnpm reset
```

### Clear cache
```bash
expo start --clear
```

### iOS build issues
- Ensure Xcode is installed and up to date
- Check iOS simulator is running

### Android build issues
- Ensure Android Studio is installed
- Check Android emulator is running
- Verify ANDROID_HOME environment variable is set

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## License

MIT
