import axios from "axios";
import { analyzeStock, chatWithAI } from "../ai/lyzer";

export type ErrorType = "NOT_FOUND" | "API_ERROR" | "RATE_LIMIT" | "NETWORK_ERROR" | "INVALID_QUERY" | "EMPTY_RESULTS";

export class ApiError extends Error {
  constructor(public type: ErrorType, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
 getMarketOverview: () => axios.get("http://localhost:3000/api/market-overview").then((res) => res.data),
  
  getStockData: async (ticker: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/stock/${ticker}`);
      if (!res.data || !res.data.quote) {
        throw new ApiError("NOT_FOUND", `The ticker symbol '${ticker}' could not be located in our intelligence database.`);
      }
      return res.data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      if (err.response?.status === 404) {
        throw new ApiError("NOT_FOUND", err.response.data.error || `The ticker symbol '${ticker}' could not be located.`);
      }
      if (!navigator.onLine) throw new ApiError("NETWORK_ERROR", "The connection to our intelligence grid has been lost.");
      if (err.response?.status === 429) throw new ApiError("RATE_LIMIT", "You've reached the current limit of our intelligence processing.");
      throw new ApiError("API_ERROR", "Our core intelligence systems are experiencing a brief disturbance.");
    }
  },

  analyzeStock: async (ticker: string) => {
    try {
      const rawData = await axios.get(`http://localhost:3000/api/stock-raw/${ticker}`).then((res) => res.data);
      if (!rawData || !rawData.quote) {
        throw new ApiError("NOT_FOUND", `Analysis cannot be performed for '${ticker}' as no data was found.`);
      }
      return analyzeStock(ticker, rawData.quote.shortName || ticker, rawData);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("API_ERROR", "The AI synthesis engine encountered an unexpected interruption.");
    }
  },

  chat: (message: string, context: any) => chatWithAI(message, context),
};
