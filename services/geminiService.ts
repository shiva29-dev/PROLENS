import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateHeadshot = async (
  imageBase64: string,
  mimeType: string,
  stylePrompt: string,
  customInstruction: string
): Promise<string> => {
  try {
    // Construct a comprehensive prompt for the model
    const fullPrompt = `
      Edit this image to look like a professional headshot.
      Style requirement: ${stylePrompt}.
      Additional instructions: ${customInstruction || 'Keep the subject natural but professional.'}.
      Ensure high quality, studio lighting, and a professional appearance.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data received from the model.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
