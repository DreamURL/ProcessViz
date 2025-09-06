import { GoogleGenAI, Type } from "@google/genai";
import { Complexity, ProcessStep, VisualizationStyle, ImageFile } from '../types';
import { PROMPT_TEMPLATES } from '../constants';

const getStepCount = (complexity: Complexity): number => {
    switch (complexity) {
        case Complexity.SIMPLE: return 4;
        case Complexity.STANDARD: return 6;
        case Complexity.COMPLEX: return 8;
        default: return 5;
    }
}

export const decomposeProcessIntoSteps = async (
    apiKey: string,
    processDescription: string,
    image: ImageFile | null,
    complexity: Complexity
): Promise<ProcessStep[]> => {
    if (!apiKey) throw new Error("API key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    const stepCount = getStepCount(complexity);
    const model = 'gemini-2.5-flash';
    
    const prompt = `Analyze the following industrial process description and decompose it into exactly ${stepCount} logical, sequential steps. For each step, provide a concise title and a detailed technical description suitable for an engineer.
    
    Process: "${processDescription}"
    
    Return the output as a JSON array where each object has "title" and "description" keys.`;

    const contents = image 
        ? { parts: [{ text: prompt }, { inlineData: { mimeType: image.mimeType, data: image.base64 } }] }
        : prompt;

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as { title: string; description: string }[];
        return parsedResponse.map((step, index) => ({
            ...step,
            id: `step-${index}-${Date.now()}`
        }));
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("Could not parse the process steps from the AI response.");
    }
};

export const generateImageForStep = async (
    apiKey: string,
    step: ProcessStep,
    style: VisualizationStyle,
    previousImageBase64: string | null
): Promise<string> => {
    if (!apiKey) throw new Error("API key is missing.");
    const ai = new GoogleGenAI({ apiKey });
    
    const stylePromptTemplate = PROMPT_TEMPLATES[style];
    let detailedPrompt = stylePromptTemplate.replace('{step_description}', step.description);

    if(previousImageBase64) {
      detailedPrompt += "\n- This is a subsequent step in a sequence. Use the provided reference image of the previous step to ensure visual and logical continuity. Equipment, pipes, and materials should flow seamlessly from the previous state into this new state.";
    } else {
      detailedPrompt += "\n- This is the first step in the process. Establish a clear and professional visual foundation for subsequent images.";
    }

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: detailedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed, no images were returned.");
    }
    
    return response.generatedImages[0].image.imageBytes;
};

export const generateAudioScript = async (apiKey: string, step: ProcessStep): Promise<string> => {
    if (!apiKey) throw new Error("API key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    const model = 'gemini-2.5-flash';
    const prompt = `Convert the following technical process step description into a professional, clear, and engaging audio narration script. The script should be around 2-3 sentences and suitable for a technical presentation.
    
    Technical Description: "${step.description}"
    
    Narration Script:`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text.trim();
};