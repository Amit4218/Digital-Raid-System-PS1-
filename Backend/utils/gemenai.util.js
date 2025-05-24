import { GoogleGenAI } from "@google/genai";
import systemPrompt from "./systemPrompt.js";

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const gemenai = async (data, retries = 3) => {
  try {
    const contents = [
      {
        role: "user",
        parts: [
          { text: systemPrompt },
          { text: `Complaint Type: ${data.complaintType}` },
          { text: `Transport Mode: ${data.transportMode}` },
          { text: `Address: ${data.address}` },
          { text: `Description: ${data.description}` },
        ],
      },
    ];

    // Check if we have media to determine the model
    const hasMedia =
      (data.images && data.images.length > 0) ||
      (data.videos && data.videos.length > 0);

    // Add media if available
    if (hasMedia) {
      [...(data.images || []), ...(data.videos || [])].forEach((mediaUrl) => {
        const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov");
        contents[0].parts.push({
          fileData: {
            mimeType: isVideo ? "video/mp4" : "image/jpeg",
            fileUri: mediaUrl,
          },
        });
      });
    }

    // Choose the appropriate model
    const modelName = hasMedia ? "gemini-pro-vision" : "gemini-pro";

    const response = await ai.models.generateContent({
      model: modelName, // Use the correct model name
      contents: contents,
    });

    return response.text;
  } catch (error) {
    if (error.code === 429 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10s
      return gemenai(data, retries - 1);
    }
    console.error("Gemini API error:", error);
    return "AI analysis temporarily unavailable";
  }
};

export default gemenai;
