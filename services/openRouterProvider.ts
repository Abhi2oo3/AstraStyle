import type { ImageData } from "../types";
import { blobToBase64 } from "../utils/fileUtils";

// Fix: Use process.env for environment variables to avoid TypeScript errors with ImportMeta
const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("VITE_OPENROUTER_API_KEY environment variable is not set.");
}

const API_HOST = "https://openrouter.ai/api/v1";

// Helper to extract the URL from the markdown response
const extractImageUrl = (markdownText: string): string | null => {
    const regex = /!\[.*\]\((.*)\)/;
    const match = markdownText.match(regex);
    return match ? match[1] : null;
};

export async function generateTryOnImage(
  modelImage: ImageData,
  outfitImage: ImageData
): Promise<string> {
  const modelImageUrl = `data:${modelImage.mimeType};base64,${modelImage.base64}`;
  const outfitImageUrl = `data:${outfitImage.mimeType};base64,${outfitImage.base64}`;

  const prompt = `You are an expert at virtual try-on. Your task is to take the person from the first image and the clothing from the second image. Generate a new, photorealistic image of the person wearing the clothing.
  Key requirements:
  1. The clothing must fit the person's body and pose realistically.
  2. The background, lighting, and shadows from the person's original image must be preserved.
  3. The final image should only contain the person wearing the new outfit, without any extra text or artifacts.`;

  try {
    // Step 1: Call OpenRouter to get the image URL
    const response = await fetch(`${API_HOST}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'playgroundai/playground-v2.5',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: modelImageUrl } },
              { type: 'image_url', image_url: { url: outfitImageUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API Error:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const messageContent = data.choices[0]?.message?.content;

    if (!messageContent) {
        throw new Error("Model did not return any content.");
    }
    
    const imageUrl = extractImageUrl(messageContent);
    
    if (!imageUrl) {
        console.error("Could not parse image URL from response:", messageContent);
        throw new Error("Model response did not contain a valid image URL.");
    }

    // Step 2: Fetch the generated image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        throw new Error(`Failed to download the generated image. Status: ${imageResponse.status}`);
    }
    const imageBlob = await imageResponse.blob();

    // Step 3: Convert the image blob to a Base64 string to display in the app
    const base64Data = await blobToBase64(imageBlob);
    
    return base64Data.base64;

  } catch (error) {
    console.error("OpenRouter call failed:", error);
    throw new Error("The AI model failed to process the images. Please try different images or try again later.");
  }
}