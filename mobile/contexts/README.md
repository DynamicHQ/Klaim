# Mobile Context Providers

This directory contains all React Context providers for the mobile application.

## Available Contexts

### 1. WalletContext
Manages blockchain wallet connections using WalletConnect v2.

**Features:**
- Connect/disconnect wallet via WalletConnect
- Get wallet address and provider
- Get signer for transactions
- Switch to Story Protocol Testnet
- Persist wallet connection across app restarts

**Usage:**
```javascript
import { useWallet } from '../contexts/WalletContext';

function MyComponent() {
  const { address, isConnected, connect, disconnect, getSigner } = useWallet();
  
  // Connect wallet
  await connect();
  
  // Get signer for transactions
  const signer = await getSigner();
}
```

### 2. AuthContext
Manages user authentication with backend API and biometric support.

**Features:**
- Signup and login with wallet signature
- Biometric authentication (fingerprint/face ID)
- Persist auth state with AsyncStorage
- Auto-logout on unauthorized responses

**Usage:**
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    signup, 
    loginWithBiometric,
    logout 
  } = useAuth();
  
  // Login with wallet
  await login();
  
  // Login with biometrics
  await loginWithBiometric();
}
```

### 3. ThemeContext
Manages app theme (light/dark mode) with system preference support.

**Features:**
- Light and dark themes
- System theme detection
- Theme persistence
- Comprehensive design tokens (colors, fonts, spacing, shadows)

**Usage:**
```javascript
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, colors, spacing, setTheme, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

### 4. CacheContext
Manages offline data caching with TTL support.

**Features:**
- Cache data with configurable TTL
- Get/set/remove cache operations
- Clear expired cache entries
- Cache statistics and hit rate tracking
- Pattern-based cache invalidation

**Usage:**
```javascript
import { useCache } from '../contexts/CacheContext';

function MyComponent() {
  const { getCached, setCache, getOrSet, TTL } = useCache();
  
  // Get cached data
  const data = await getCached('assets_list');
  
  // Set cache with 5-minute TTL
  await setCache('assets_list', assets, TTL.MEDIUM);
  
  // Get or fetch if not cached
  const assets = await getOrSet('assets_list', fetchAssets, TTL.MEDIUM);
}
```

## Provider Setup

All providers should be wrapped in the root layout (`app/_layout.js`):

```javascript
import { 
  ThemeProvider, 
  AuthProvider, 
  WalletProvider, 
  CacheProvider 
} from '../contexts';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CacheProvider>
        <WalletProvider>
          <AuthProvider>
            {/* Your app content */}
          </AuthProvider>
        </WalletProvider>
      </CacheProvider>
    </ThemeProvider>
  );
}
```

## Dependencies

Make sure these packages are installed:
- `@react-native-async-storage/async-storage`
- `@walletconnect/modal-react-native`
- `expo-local-authentication`
- `ethers`

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect project ID from: https://cloud.walletconnect.com/
