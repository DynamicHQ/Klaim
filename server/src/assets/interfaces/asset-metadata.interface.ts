export interface NftInfo {
  name: string;
  description: string;
  image_url: string;
}

export interface IpInfo {
  title: string;
  description: string;
  creator: string; // wallet address
  createdat: string; // ISO timestamp
}

export interface AssetMetadata {
  nft_info: NftInfo;
  ip_info: IpInfo;
}

