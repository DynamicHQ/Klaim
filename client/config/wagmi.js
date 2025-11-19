import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Story Protocol Testnet configuration
export const storyTestnet = {
  id: 1513,
  name: 'Story Protocol Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: { http: ['https://testnet.storyrpc.io'] },
    public: { http: ['https://testnet.storyrpc.io'] },
  },
  blockExplorers: {
    default: { name: 'Story Explorer', url: 'https://testnet.storyscan.xyz' },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [storyTestnet, mainnet, sepolia],
  transports: {
    [storyTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
