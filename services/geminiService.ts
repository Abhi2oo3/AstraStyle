
import { GoogleGenAI } from "@google/genai";
import type { ImageData } from "../types";

export async function generateTryOnImage(
  modelImage: ImageData,
  outfitImage: ImageData,
  customInstructions: string = "",
  presetBackground: string = "original"
): Promise<ImageData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const backgroundContext = {
    "original": "Keep the background and lighting of the person's original image exactly the same.",
    "runway": "Place the person on a professional high-fashion runway with dramatic spotlighting.",
    "studio": "Place the person in a minimalist, professional photography studio with soft-box lighting and a clean neutral backdrop.",
    "urban": "Place the person in a trendy urban city street setting with natural daylight and realistic depth of field.",
    "luxury": "Place the person in a high-end luxury boutique or penthouse interior with elegant warm lighting."
  }[presetBackground as keyof typeof backgroundContext] || "";

  const modelImagePart = {
    inlineData: {
      data: modelImage.base64,
      mimeType: modelImage.mimeType,
    },
  };

  const outfitImagePart = {
    inlineData: {
      data: outfitImage.base64,
      mimeType: outfitImage.mimeType,
    },
  };
  
  const textPart = {
      text: `You are an expert at virtual try-on and high-end fashion photography. 
      TASK: Replace the clothing on the person in the first image with the clothing from the second image.
      
      STRICT IDENTITY PRESERVATION:
      1. You MUST keep the person's face, hair, skin tone, and body proportions EXACTLY as they appear in the original image.
      2. DO NOT alter the person's identity, age, or facial features. 
      3. The only change should be the outfit they are wearing.
      
      VISUAL STYLE: ${backgroundContext}
      
      TECHNICAL REQUIREMENTS:
      1. Photorealistic result. The new clothing must conform to the person's body pose, contours, and natural drapery.
      2. Seamless blend. Match the lighting and shadows of the scene to the person and the new garment perfectly.
      3. ${customInstructions ? `Additional Style Notes: ${customInstructions}` : "Ensure a professional, high-end commercial look."}`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
          parts: [modelImagePart, outfitImagePart, textPart],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png',
          };
        }
      }
    }
    throw new Error("Model failed to generate image.");
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
}

/**
 * Uses Gemini 3 Flash to generate structured merchant insights.
 */
export async function generateStylingAdvice(
  productName: string,
  resultImage: ImageData
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = {
    inlineData: {
      data: resultImage.base64,
      mimeType: resultImage.mimeType,
    },
  };

  const prompt = `You are a Luxury Fashion Retail Consultant. Analyze this virtual try-on for "${productName || 'this item'}".
  Provide a structured response using exactly these headers:
  
  [MARKET APPEAL]
  Identify the target audience and why they will love this specific look.
  
  [STYLING STRATEGY]
  3 distinct bullet points. Each point MUST start with a bold category label followed by a colon, e.g., "**Footwear:** ...", "**Accessories:** ...", "**Grooming/Hair:** ...".
  
  [CATALOG COPY]
  A professional 2-sentence description for a web store.
  
  [SOCIAL MEDIA HOOK]
  A short, engaging caption for Instagram including relevant hashtags.
  
  Keep it professional, concise, and ready for a merchant to use immediately.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text || "Styling analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analysis offline.";
  }
}
