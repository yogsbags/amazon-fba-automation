
import { GoogleGenAI, Type, GenerateContentResponse, Modality, FunctionDeclaration } from "@google/genai";
import { SourcingRecommendation, KeywordResearchResult, InnovationBlueprint, ViralHook, EarlyPick, CompetitorData, PPCMetric, Persona, BrandingCollateral, APlusModule, StorePageSection, TikTokProduct, PackagingAsset, PPCStrategy } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// ... existing tool declarations remain the same ...
const ppcOptimizerTool: FunctionDeclaration = { name: 'optimize_ppc', parameters: { type: Type.OBJECT, description: 'Optimizes Amazon PPC bids based on product financials and lifecycle strategy.', properties: { category: { type: Type.STRING }, unitCost: { type: Type.NUMBER }, retailPrice: { type: Type.NUMBER }, strategy: { type: Type.STRING, description: 'LAUNCH (High ACOS), GROWTH (2x-4x ROAS), HARVEST (>4x ROAS)' } }, required: ['category', 'unitCost', 'retailPrice', 'strategy'] } };
const marketResearchTool: FunctionDeclaration = { name: 'research_market', parameters: { type: Type.OBJECT, description: 'Performs deep keyword and competitor research for a specific product category.', properties: { category: { type: Type.STRING, description: 'The product category to research.' } }, required: ['category'] } };
const generateListingTool: FunctionDeclaration = { name: 'generate_fba_listing', parameters: { type: Type.OBJECT, description: 'Generates a high-converting Amazon FBA listing including Title, Bullets, and Description.', properties: { productName: { type: Type.STRING }, features: { type: Type.STRING }, targetMarket: { type: Type.STRING, description: 'e.g. USA, UK, UAE' } }, required: ['productName', 'features'] } };
const sourcingTool: FunctionDeclaration = { name: 'sourcing_blueprint', parameters: { type: Type.OBJECT, description: 'Finds suppliers on Alibaba and calculates potential profit margins.', properties: { productName: { type: Type.STRING } }, required: ['productName'] } };
const brandingTool: FunctionDeclaration = { name: 'branding_overhaul', parameters: { type: Type.OBJECT, description: 'Identifies target personas and generates full branding collateral.', properties: { productName: { type: Type.STRING }, features: { type: Type.STRING } }, required: ['productName', 'features'] } };
const packagingTool: FunctionDeclaration = { name: 'logistic_design', parameters: { type: Type.OBJECT, description: 'Designs outer box packaging, insert cards, and user manuals.', properties: { productName: { type: Type.STRING }, specs: { type: Type.STRING }, brandName: { type: Type.STRING } }, required: ['productName', 'brandName'] } };
const viralAgentTool: FunctionDeclaration = { name: 'viral_accelerator', parameters: { type: Type.OBJECT, description: 'Analyzes TikTok trends and generates viral video hooks/scripts.', properties: { category: { type: Type.STRING } }, required: ['category'] } };

export const processAgentQuery = async (query: string, chatHistory: any[], media?: { data: string, mimeType: string }): Promise<{ text: string, toolCalls?: any[] }> => {
  const ai = getAIClient();
  const userParts: any[] = [{ text: query }];
  if (media) userParts.push({ inlineData: { data: media.data, mimeType: media.mimeType } });
  const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: [...chatHistory, { role: 'user', parts: userParts }], config: { systemInstruction: `You are the Astra FBA Neural Agent...`, tools: [{ functionDeclarations: [ppcOptimizerTool, marketResearchTool, generateListingTool, sourcingTool, brandingTool, packagingTool, viralAgentTool] }] } });
  return { text: response.text || "Neural logic path established.", toolCalls: response.functionCalls };
};

export const analyzeMarketPPC = async (category: string, unitCost: number = 0, retailPrice: number = 0, strategy: PPCStrategy = 'GROWTH'): Promise<PPCMetric[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: `Perform an Amazon Adtomic-style PPC audit for '${category}'...`, config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, searchVolume: { type: Type.NUMBER }, googleVolume: { type: Type.NUMBER }, currentBid: { type: Type.NUMBER }, recommendedBid: { type: Type.NUMBER }, roas: { type: Type.NUMBER }, acos: { type: Type.NUMBER }, cvr: { type: Type.NUMBER }, impressions: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['optimized', 'adjusting', 'attention', 'waste'] }, campaignType: { type: Type.STRING, enum: ['AUTO', 'EXACT', 'PHRASE', 'BRAND', 'PRODUCT'] } }, required: ['keyword', 'currentBid', 'recommendedBid', 'roas', 'acos', 'cvr', 'status', 'campaignType'] } } } });
  return JSON.parse(response.text);
};

export const generatePackagingSuite = async (productName: string, specs: string, brandName: string, lang: string): Promise<PackagingAsset[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a premium Amazon FBA Packaging Suite for '${productName}' under brand '${brandName}'. Locale: ${lang}.
    
    SPECIAL FOCUS FOR 'Insert Card' (MANDATORY 7-POINT CHECKLIST):
    1. Human-Touch Thank You card content.
    2. Clear, condensed usage instructions.
    3. High-priority support contact routing (to stop returns).
    4. Warranty activation CTA.
    5. TOS-compliant review request (no incentives).
    6. Compelling brand story/mission snippet.
    7. QR Code call-to-action for bonus digital content/guides.
    
    Return a JSON array of 3 assets: 'Outer Box', 'Insert Card', 'User Manual'.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['Outer Box', 'Insert Card', 'User Manual'] },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            specSummary: { type: Type.STRING },
            fbaFeeTier: { type: Type.STRING, enum: ['Small Standard', 'Large Standard', 'Oversize', 'N/A'] },
            primaryBenefitStatement: { type: Type.STRING },
            visualCueStrategy: { type: Type.STRING },
            brandConsistencyScore: { type: Type.NUMBER },
            insertFeatures: {
              type: Type.OBJECT,
              properties: {
                thankYouText: { type: Type.STRING },
                usageInstructionsSnippet: { type: Type.STRING },
                supportRouting: { type: Type.STRING },
                warrantyCTA: { type: Type.STRING },
                reviewRequestPolicy: { type: Type.STRING },
                brandStorySnippet: { type: Type.STRING },
                qrCodeStrategy: { type: Type.STRING }
              }
            }
          },
          required: ['type', 'title', 'description', 'imagePrompt', 'specSummary', 'fbaFeeTier', 'primaryBenefitStatement', 'visualCueStrategy', 'brandConsistencyScore']
        }
      }
    }
  });
  return JSON.parse(response.text);
};

// ... other service functions (generateLogo, etc.) remain as placeholders or implemented as needed ...
export const generateLogo = async (b: string, s: string, c: string, cat: string): Promise<string | undefined> => { return ''; };
export const findTrendingTikTokProducts = async (c: string): Promise<TikTokProduct[]> => { return []; };
export const generateUGCVideo = async (p: string, v: string): Promise<string | undefined> => { return ''; };
export const identifyTargetAudience = async (p: string, f: string): Promise<Persona[]> => { return []; };
export const generateBrandingCollateral = async (p: string, pers: Persona[]): Promise<BrandingCollateral[]> => { return []; };
export const generateAPlusContent = async (p: string, f: string, t: string): Promise<APlusModule[]> => { return []; };
export const generateStorePage = async (b: string, p: string): Promise<StorePageSection[]> => { return []; };
export const snipeEarlyOpportunities = async (m: string): Promise<EarlyPick[]> => { return []; };
export const generateListing = async (p: string, f: string, l: string, m: string, i?: string): Promise<any> => { return {}; };
export const generateProductImage = async (p: string, ar: any, s: string, d: string, t: string): Promise<string | undefined> => { return ''; };
export const generateProductVideo = async (p: string, t: string): Promise<string | undefined> => { return ''; };
export const analyzeSentimentArbitrage = async (c: string): Promise<InnovationBlueprint> => { return {} as any; };
export const generateViralHooks = async (p: string, f: string): Promise<ViralHook[]> => { return []; };
export const researchSourcingOptions = async (p: string): Promise<SourcingRecommendation[]> => { return []; };
export const researchKeywords = async (s: string): Promise<KeywordResearchResult[]> => { return []; };
export const analyzeCompetitors = async (p: string): Promise<CompetitorData[]> => { return []; };
