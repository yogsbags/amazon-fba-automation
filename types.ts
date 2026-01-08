
export enum ViewType {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  LISTING_WRITER = 'LISTING_WRITER',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',
  KEYWORD_RESEARCH = 'KEYWORD_RESEARCH',
  PPC_OPTIMIZER = 'PPC_OPTIMIZER',
  INTEGRATIONS = 'INTEGRATIONS',
}

export interface ProductAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  category: string;
}

export interface ListingContent {
  title: string;
  bullets: string[];
  description: string;
  seoKeywords: string[];
}

export interface PPCMetric {
  keyword: string;
  searchVolume: number;
  currentBid: number;
  recommendedBid: number;
  roas: number;
  status: 'optimized' | 'adjusting' | 'attention';
}

export interface CompetitorData {
  name: string;
  topKeywords: string[];
  imageStrategy: string[];
  usps: string[];
  rating: number;
}

export interface KeywordResearchResult {
  keyword: string;
  volume: number;
  cpc: number;
  relevance: 'High' | 'Medium' | 'Low';
}

export interface ConnectionStatus {
  isConnected: boolean;
  merchantId?: string;
  marketplace?: string;
  lastSync?: string;
}
