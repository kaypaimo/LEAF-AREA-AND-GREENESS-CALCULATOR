
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeLeafImage = async (file: File): Promise<AnalysisResult> => {
  if (!API_KEY) throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Convert File to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const prompt = `
    Analyze this scientific sample of a leaf.
    The image contains two distinct calibration marker dots which are exactly 10 cm apart.
    
    TASKS:
    1. Identify the two calibration dots. Measure the distance between their centers in pixels.
    2. Use this pixel distance to establish a scale (10 cm = [X] pixels).
    3. Segment the leaf area from the background. 
    4. Calculate:
       - Total surface area in cm².
       - Total perimeter (boundary length) in cm.
       - Circularity index (4 * pi * Area / Perimeter^2), where 1.0 is a perfect circle.
       - Mean Greenness Intensity (average green channel value of leaf pixels, 0-255).
    5. Determine a 'Greenness Index' (0-100) where 100 is perfectly deep green (high chlorophyll) and 0 is yellow/brown.
    6. Identify the dominant color of the leaf in Hex format and potential plant/leaf type.
    7. Provide a detailed confidence breakdown for the segmentation, calibration, and color fidelity.
    8. Provide the bounding box for the leaf and the exact coordinates for the two dots for verification.
    
    IMPORTANT: Be mathematically precise. If the leaf is complex (lobed), calculate the cumulative area and perimeter of the total leaf structure.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leafAreaCm2: { type: Type.NUMBER, description: "Calculated surface area in square centimeters" },
          perimeterCm: { type: Type.NUMBER, description: "Calculated perimeter in centimeters" },
          circularity: { type: Type.NUMBER, description: "Shape circularity index (0-1)" },
          meanGreenness: { type: Type.NUMBER, description: "Average green channel intensity (0-255)" },
          greennessIndex: { type: Type.NUMBER, description: "Chlorophyll-relative greenness score 0-100" },
          confidence: { type: Type.NUMBER, description: "Overall probability of accurate detection 0-1" },
          metadata: {
            type: Type.OBJECT,
            properties: {
              pixelToCmRatio: { type: Type.NUMBER },
              dominantColorHex: { type: Type.STRING },
              leafState: { type: Type.STRING, description: "e.g., 'Vibrant', 'Senescent', 'Stressed'" },
              detectedLeafType: { type: Type.STRING, description: "Species or common name of the leaf" }
            },
            required: ["pixelToCmRatio", "dominantColorHex", "leafState", "detectedLeafType"]
          },
          confidenceBreakdown: {
            type: Type.OBJECT,
            properties: {
              segmentation: { type: Type.NUMBER },
              calibration: { type: Type.NUMBER },
              colorFidelity: { type: Type.NUMBER }
            },
            required: ["segmentation", "calibration", "colorFidelity"]
          },
          visualMarkers: {
            type: Type.OBJECT,
            properties: {
              dot1: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[y, x] normalized" },
              dot2: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              leafBoundingBox: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[ymin, xmin, ymax, xmax]" }
            },
            required: ["dot1", "dot2", "leafBoundingBox"]
          }
        },
        required: ["leafAreaCm2", "perimeterCm", "circularity", "meanGreenness", "greennessIndex", "confidence", "metadata", "confidenceBreakdown", "visualMarkers"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("The AI provided an invalid data format. Please try again with a clearer photo.");
  }
};
