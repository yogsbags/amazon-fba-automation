
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateListing = async (productName: string, features: string, base64Image?: string): Promise<any> => {
  const ai = getAIClient();
  const parts: any[] = [{ text: `Generate a high-converting Amazon FBA listing for: ${productName}. Key Features: ${features}. Provide JSON output including: title (max 200 chars), bullets (5 bullet points), description (HTML supported), and 10 SEO backend keywords.` }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'bullets', 'description', 'seoKeywords']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateProductImage = async (
  prompt: string, 
  aspectRatio: "1:1" | "16:9" | "9:16" = "1:1",
  style: string = 'professional',
  demographic: string = 'general'
): Promise<string | undefined> => {
  const ai = getAIClient();
  const enhancedPrompt = `Style: ${style}. Target Audience: ${demographic}. Prompt: ${prompt}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: enhancedPrompt }] },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

export const generateProductVideo = async (prompt: string): Promise<string | undefined> => {
  const ai = getAIClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return undefined;

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const analyzeCompetitors = async (productType: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Search for top selling ${productType} on Amazon. Analyze the top 5 competitors. Provide a JSON array of competitor objects, each with: name, topKeywords (array), imageStrategy (array describing their 7 images), usps (array of unique selling points), and rating (number).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            topKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            imageStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
            usps: { type: Type.ARRAY, items: { type: Type.STRING } },
            rating: { type: Type.NUMBER }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const researchKeywords = async (seed: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Research keywords related to '${seed}' for Amazon FBA. Provide a JSON array of objects with: keyword, volume (estimated monthly), cpc (estimated dollar amount), and relevance (High, Medium, or Low).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            volume: { type: Type.NUMBER },
            cpc: { type: Type.NUMBER },
            relevance: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeMarketPPC = async (category: string) => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze current Amazon PPC trends for ${category}. Provide realistic keyword data including volume, suggested bids, and target ROAS in JSON format. Assign a status of 'optimized' if ROAS > 4, 'attention' if ROAS < 2.5 or if there is a large gap between current and recommended bid, and 'adjusting' otherwise.`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        keyword: { type: Type.STRING },
                        searchVolume: { type: Type.NUMBER },
                        currentBid: { type: Type.NUMBER },
                        recommendedBid: { type: Type.NUMBER },
                        roas: { type: Type.NUMBER },
                        status: { type: Type.STRING }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text);
};
