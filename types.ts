
export enum ViewType {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  LISTING_WRITER = 'LISTING_WRITER',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',
  KEYWORD_RESEARCH = 'KEYWORD_RESEARCH',
  PPC_OPTIMIZER = 'PPC_OPTIMIZER',
  INTEGRATIONS = 'INTEGRATIONS',
  SOURCING_LAB = 'SOURCING_LAB',
  INNOVATION_LAB = 'INNOVATION_LAB',
  VIRAL_AGENT = 'VIRAL_AGENT',
  TREND_SNIPER = 'TREND_SNIPER',
  BRANDING_STUDIO = 'BRANDING_STUDIO',
  STORE_BUILDER = 'STORE_BUILDER',
  UGC_GENERATOR = 'UGC_GENERATOR',
  TIKTOK_FINDER = 'TIKTOK_FINDER',
  SETTINGS = 'SETTINGS',
  PACKAGING_STUDIO = 'PACKAGING_STUDIO',
}

export type PPCStrategy = 'LAUNCH' | 'GROWTH' | 'HARVEST';
export type CampaignType = 'AUTO' | 'EXACT' | 'PHRASE' | 'BRAND' | 'PRODUCT';

export interface PerformanceSnapshot {
  date: string;
  sessions: number;
  unitSessionPercentage: number;
  unitsSold: number;
  refundRate: number;
  organicRank: number;
  reviewCount: number;
}

export interface ABTest {
  id: string;
  assetType: 'IMAGE' | 'TITLE';
  testA_Url: string;
  testB_Url: string;
  status: 'RUNNING' | 'COMPLETED';
  winner?: 'A' | 'B';
  improvement?: number;
}

export interface PackagingAsset {
  type: 'Outer Box' | 'Insert Card' | 'User Manual';
  title: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  specSummary: string;
  fbaFeeTier: 'Small Standard' | 'Large Standard' | 'Oversize' | 'N/A';
  primaryBenefitStatement: string;
  visualCueStrategy: string;
  brandConsistencyScore: number;
  insertFeatures?: {
    hasThankYou: boolean;
    supportRouting: string;
    warrantyCTA: string;
    reviewRequestPolicy: string;
    brandStorySnippet: string;
    qrCodeStrategy: string;
  };
}

export interface SellerCredentials {
  merchantId: string;
  marketplaceId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  region: 'NA' | 'EU' | 'FE';
}

export type Marketplace = {
  id: string;
  name: string;
  lang: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
};

export const MARKETPLACES: Marketplace[] = [
  { id: 'US', name: 'USA', lang: 'English', flag: '🇺🇸' },
  { id: 'UK', name: 'UK', lang: 'English', flag: '🇬🇧' },
  { id: 'DE', name: 'Germany', lang: 'German', flag: '🇩🇪' },
  { id: 'FR', name: 'France', lang: 'French', flag: '🇫🇷' },
  { id: 'IT', name: 'Italy', lang: 'Italian', flag: '🇮🇹' },
  { id: 'ES', name: 'Spain', lang: 'Spanish', flag: '🇪🇸' },
  { id: 'NL', name: 'Netherlands', lang: 'Dutch', flag: '🇳🇱' },
  { id: 'PL', name: 'Poland', lang: 'Polish', flag: '🇵🇱' },
  { id: 'SE', name: 'Sweden', lang: 'Swedish', flag: '🇸🇪' },
  { id: 'AE', name: 'UAE', lang: 'Arabic', flag: '🇦🇪', dir: 'rtl' },
  { id: 'SA', name: 'Saudi Arabia', lang: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  { id: 'TR', name: 'Turkey', lang: 'Turkish', flag: '🇹🇷' },
  { id: 'JP', name: 'Japan', lang: 'Japanese', flag: '🇮🇵' },
];

export interface Persona {
  name: string;
  ageRange: string;
  painPoints: string[];
  buyingTriggers: string[];
  lifestyle: string;
  preferredSocials: string[];
}

export interface BrandingCollateral {
  type: string;
  headline: string;
  copy: string;
  visualPrompt: string;
}

export interface APlusModule {
  type: 'StandardImageHeader' | 'StandardThreeImageText' | 'StandardCompanyLogo';
  heading: string;
  body: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface StorePageSection {
  id: string;
  title: string;
  description: string;
  layout: 'Hero' | 'ProductGrid' | 'TextOverlay';
  imagePrompt: string;
  imageUrl?: string;
}

export interface TikTokProduct {
  name: string;
  hashtags: string[];
  viralScore: number;
  viewCount: string;
  reason: string;
  adOpportunity: string;
}

export interface ListingContent {
  title: string;
  bullets: string[];
  description: string;
  seoKeywords: string[];
  aplusModules?: APlusModule[];
}

export interface EarlyPick { productName: string; niche: string; socialMomentum: number; earlyMoverIndex: number; estimatedSaturationDate: string; alibabaUnitCost: number; projectedAmzPrice: number; potentialProfit: number; alibabaLink: string; whyItsWinning: string; }
export interface SentimentGap { complaint: string; frequency: string; proposedFix: string; impactOnSales: string; }
export interface InnovationBlueprint { v2ProductName: string; targetCompetitor: string; sentimentGaps: SentimentGap[]; designDirectives: string[]; estimatedMarketShareGain: number; }
export interface ViralHook { platform: 'TikTok' | 'Instagram' | 'Youtube'; hookType: 'Problem/Solution' | 'Lifestyle/Aesthetic' | 'Unboxing/ASMR'; script: string; visualDirections: string[]; trendingAudioVibe: string; }
export interface SourcingRecommendation { supplierName: string; productName: string; unitCost: number; moq: number; leadTime: string; estimatedMargin: number; amazonPrice: number; alibabaUrl: string; rating: number; verified: boolean; }
export interface AuditedProduct { id: string; sku: string; title: string; currentBullets: string; score: number; issues: string[]; }
export interface PPCMetric { 
  keyword: string; 
  searchVolume: number; 
  googleSearchVolume: number; 
  currentBid: number; 
  recommendedBid: number; 
  roas: number; 
  acos: number; 
  cvr: number; 
  impressions: number; 
  status: 'optimized' | 'adjusting' | 'attention' | 'waste';
  campaignType: CampaignType;
  profitContribution?: number; 
}
export interface CompetitorData { name: string; topKeywords: string[]; imageStrategy: string[]; usps: string[]; rating: number; }
export interface KeywordResearchResult { keyword: string; volume: number; googleVolume: number; cpc: number; relevance: 'High' | 'Medium' | 'Low'; trend: 'up' | 'down' | 'stable'; }
export interface AutomationLog { id: string; timestamp: string; action: string; details: string; type: 'info' | 'success' | 'warning'; }
