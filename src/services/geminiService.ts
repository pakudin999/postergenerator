import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY, validateApiKey } from "../config/api";
import { PersonImagePayload } from "../types";

const genAI = new GoogleGenerativeAI(API_KEY);

export const generatePosterPrompt = async (
    styleImageBase64: string,
    styleImageMime: string,
    description: string,
    personImageBase64?: string | null,
    personImageMime?: string
): Promise<string> => {
    if (!validateApiKey()) {
        throw new Error('API key not configured. Please add your Gemini API key to .env file.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    const parts: any[] = [];

    if (personImageBase64 && personImageMime) {
        // Pro Mode: Composite person into poster
        prompt = `You are an expert poster designer and prompt engineer. Analyze these two images:

1. STYLE REFERENCE IMAGE: Study the artistic style, color palette, composition, typography style, and overall aesthetic
2. PERSON IMAGE: A person who should be composited into the poster design

USER'S POSTER DESCRIPTION: ${description}

Create a detailed AI image generation prompt that:
- Captures the exact visual style, color scheme, and artistic approach from the reference image
- Composites the person from the second image as the main subject of the poster
- Incorporates the user's description for the poster content
- Maintains the reference image's aesthetic while featuring the person prominently
- Includes specific details about typography, layout, and design elements

Generate ONLY the final prompt text, no explanations or meta-commentary.`;

        parts.push(
            { text: prompt },
            {
                inlineData: {
                    data: styleImageBase64,
                    mimeType: styleImageMime
                }
            },
            {
                inlineData: {
                    data: personImageBase64,
                    mimeType: personImageMime
                }
            }
        );
    } else {
        // Standard Mode: Just style analysis
        prompt = `You are an expert poster designer and prompt engineer. Analyze the style, color palette, composition, typography, and overall aesthetic of this reference image.

USER'S POSTER DESCRIPTION: ${description}

Create a detailed AI image generation prompt that captures the exact visual style and artistic approach from the reference image, but applies it to the user's described poster concept.

The prompt should include:
- Specific artistic style and medium (e.g., vintage print, modern digital, hand-drawn, etc.)
- Color palette and mood
- Typography style and layout approach
- Compositional elements
- Any distinctive visual characteristics

Generate ONLY the final prompt text, no explanations or meta-commentary.`;

        parts.push(
            { text: prompt },
            {
                inlineData: {
                    data: styleImageBase64,
                    mimeType: styleImageMime
                }
            }
        );
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
};

export const generateCompositePosterPrompt = async (
    styleImageBase64: string,
    styleImageMime: string,
    description: string,
    personImages: PersonImagePayload[]
): Promise<string> => {
    if (!validateApiKey()) {
        throw new Error('API key not configured. Please add your Gemini API key to .env file.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert poster designer and prompt engineer. Analyze these images:

1. STYLE REFERENCE IMAGE: Study the artistic style, color palette, composition, typography style, and overall aesthetic
2. GROUP OF PEOPLE (${personImages.length} images): Multiple people who should ALL be composited together into ONE poster design

USER'S POSTER DESCRIPTION: ${description}

Create a detailed AI image generation prompt that:
- Captures the exact visual style, color scheme, and artistic approach from the reference image
- Composites ALL ${personImages.length} people from the provided images together as a unified group in the poster
- Incorporates the user's description for the poster content
- Maintains the reference image's aesthetic while featuring all people prominently as a cohesive group
- Includes specific details about typography, layout, and design elements
- Ensures all individuals are clearly visible and well-integrated into the composition

Generate ONLY the final prompt text, no explanations or meta-commentary.`;

    const parts: any[] = [{ text: prompt }];

    // Add style reference
    parts.push({
        inlineData: {
            data: styleImageBase64,
            mimeType: styleImageMime
        }
    });

    // Add all person images
    personImages.forEach((personImage) => {
        parts.push({
            inlineData: {
                data: personImage.base64,
                mimeType: personImage.mime
            }
        });
    });

    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
};
