
import { GoogleGenAI, Type } from "@google/genai";
import { type ContentType, type StructureItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a client-side check. The app will fail to call the API,
  // and the error will be caught in the App component, informing the user.
  console.error("API_KEY environment variable not set.");
}

const getAIClient = () => new GoogleGenAI({ apiKey: API_KEY });

const structureSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The title of the module or chapter.',
      },
      children: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'A list of lesson or section titles within this module/chapter.',
      },
    },
    required: ['title', 'children'],
  },
};

export const generateStructure = async (topic: string, contentType: ContentType): Promise<StructureItem[]> => {
  const ai = getAIClient();
  const parentTerm = contentType === 'Course' ? 'modules' : 'chapters';
  const childTerm = contentType === 'Course' ? 'lessons' : 'sections';

  const prompt = `
    You are an expert instructional designer and author.
    Create a detailed ${contentType.toLowerCase()} outline for the topic: "${topic}".
    The structure should be broken down into ${parentTerm}, and each ${parentTerm.slice(0,-1)} should contain several ${childTerm}.
    Provide the output in a structured JSON format according to the provided schema. The 'children' property should contain the list of ${childTerm}.
    Ensure the titles are concise, clear, and logically ordered.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: structureSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    // Basic validation to ensure it matches our expected structure
    if (Array.isArray(parsed) && parsed.every(item => 'title' in item && 'children' in item)) {
      return parsed as StructureItem[];
    } else {
      throw new Error("Generated JSON does not match the expected structure.");
    }

  } catch (error) {
    console.error("Error generating structure with Gemini:", error);
    throw new Error("Failed to generate a valid course/e-book structure.");
  }
};

export const generateDetailedContent = async (
  topic: string,
  contentType: ContentType,
  parentTitle: string,
  childTitle: string
): Promise<string> => {
  const ai = getAIClient();
  const parentTerm = contentType === 'Course' ? 'Module' : 'Chapter';
  const childTerm = contentType === 'Course' ? 'Lesson' : 'Section';

  const prompt = `
    You are an expert educator and writer with a talent for making complex topics easy to understand.
    Write the detailed content for the following part of a ${contentType.toLowerCase()} about "${topic}".

    - ${parentTerm}: "${parentTitle}"
    - ${childTerm}: "${childTitle}"

    Your task is to write the main body of content for this specific ${childTerm}.
    The content should be comprehensive, engaging, and well-structured.
    Use simple markdown for formatting (like bold text or lists) if it helps clarity.
    Do NOT repeat the ${childTerm} title in your response. Begin the content directly.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating detailed content with Gemini:", error);
    throw new Error("Failed to generate content for the selected item.");
  }
};
