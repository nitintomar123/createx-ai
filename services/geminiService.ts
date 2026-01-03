import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize the API client
// Ideally process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_TEXT = 'gemini-3-flash-preview';
const MODEL_IMAGE = 'gemini-2.5-flash-image';

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  lastMessage: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_TEXT,
      history: history,
      config: {
        systemInstruction: "You are CreateX, an advanced AI assistant by Nitro Studio. You are helpful, creative, and concise. Your tone is futuristic and professional.",
      }
    });

    const response = await chat.sendMessage({ message: lastMessage });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error connecting to CreateX neural net.";
  }
};

export const analyzeScriptsAndSuggestTopics = async (scripts: string): Promise<string[]> => {
  try {
    const prompt = `
      Analyze the following reference video scripts/ideas provided by a creator. 
      Identify the style, tone, and niche.
      Then, suggest 5 NEW, viral-worthy video topics that fit this creator's style.
      Return ONLY the list of 5 topics, one per line, no numbering or extra text.
      
      Reference Scripts:
      ${scripts}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
    });

    const text = response.text || "";
    return text.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Analysis Error:", error);
    return ["Error analyzing scripts. Please try again."];
  }
};

export const generateFullScriptAndDescription = async (
  topic: string,
  type: string,
  language: string
): Promise<{ script: string; description: string; thumbnailPrompt: string }> => {
  try {
    const prompt = `
      Create a full video script and metadata for the following parameters:
      Topic: ${topic}
      Format: ${type}
      Language: ${language}

      Output Format (Strict JSON):
      {
        "script": "The full spoken script including scene directions...",
        "description": "A catchy, SEO-friendly video description with hashtags...",
        "thumbnail_prompt": "A detailed visual description to generate a high CTR thumbnail for this video..."
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    
    return {
      script: parsed.script || "Failed to generate script.",
      description: parsed.description || "Failed to generate description.",
      thumbnailPrompt: parsed.thumbnail_prompt || `A futuristic thumbnail for ${topic}`
    };
  } catch (error) {
    console.error("Script Gen Error:", error);
    throw new Error("Failed to generate script content.");
  }
};

export const generateThumbnail = async (prompt: string, ratio: AspectRatio): Promise<string | null> => {
  try {
    // Mapping strict types for the API
    let apiRatio = "1:1";
    if (ratio === AspectRatio.PORTRAIT) apiRatio = "9:16";
    if (ratio === AspectRatio.LANDSCAPE) apiRatio = "16:9";

    // Instructions say: use gemini-2.5-flash-image with generateContent
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: apiRatio as "1:1" | "9:16" | "16:9",
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};