import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface StockAnalysis {
  stock_name: string;
  overview: string;
  bull_case: string[];
  bear_case: string[];
  valuation: string;
  risk_level: "Low" | "Medium" | "High";
  final_verdict: "Buy" | "Hold" | "Avoid";
  time_horizon: string;
  confidence_score?: number;
}

export async function analyzeStock(ticker: string, companyName: string, marketData: any): Promise<StockAnalysis> {
  const prompt = `
    Analyze the stock ${ticker} (${companyName}) based on the following market data:
    ${JSON.stringify(marketData, null, 2)}

    Provide a deep, institutional-grade analysis in JSON format.
    The response MUST follow this exact structure:
    {
      "stock_name": "Full Company Name",
      "overview": "A concise but deep overview of the company's current position.",
      "bull_case": ["Point 1", "Point 2", "Point 3"],
      "bear_case": ["Point 1", "Point 2", "Point 3"],
      "valuation": "Detailed valuation analysis (e.g., P/E, DCF thoughts).",
      "risk_level": "Low" | "Medium" | "High",
      "final_verdict": "Buy" | "Hold" | "Avoid",
      "time_horizon": "Recommended investment duration (e.g., 12-24 months)",
      "confidence_score": 0.85
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stock_name: { type: Type.STRING },
          overview: { type: Type.STRING },
          bull_case: { type: Type.ARRAY, items: { type: Type.STRING } },
          bear_case: { type: Type.ARRAY, items: { type: Type.STRING } },
          valuation: { type: Type.STRING },
          risk_level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          final_verdict: { type: Type.STRING, enum: ["Buy", "Hold", "Avoid"] },
          time_horizon: { type: Type.STRING },
          confidence_score: { type: Type.NUMBER }
        },
        required: ["stock_name", "overview", "bull_case", "bear_case", "valuation", "risk_level", "final_verdict", "time_horizon"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid AI response format");
  }
}

export async function chatWithAI(message: string, context: any) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are Lyzer AI, a world-class financial analyst. 
      You provide structured, data-driven insights. 
      Context: ${JSON.stringify(context)}
      Be professional, concise, and objective.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
