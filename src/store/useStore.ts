import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PortfolioItem {
  ticker: string;
  shares: number;
  avgPrice: number;
}

interface AppState {
  watchlist: string[];
  portfolio: PortfolioItem[];
  history: any[];
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  addToPortfolio: (item: PortfolioItem) => void;
  removeFromPortfolio: (ticker: string) => void;
  addHistory: (analysis: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      watchlist: ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"],
      portfolio: [],
      history: [],
      addToWatchlist: (ticker) =>
        set((state) => ({
          watchlist: state.watchlist.includes(ticker) ? state.watchlist : [...state.watchlist, ticker],
        })),
      removeFromWatchlist: (ticker) =>
        set((state) => ({
          watchlist: state.watchlist.filter((t) => t !== ticker),
        })),
      addToPortfolio: (item) =>
        set((state) => ({
          portfolio: [...state.portfolio.filter((p) => p.ticker !== item.ticker), item],
        })),
      removeFromPortfolio: (ticker) =>
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.ticker !== ticker),
        })),
      addHistory: (analysis) =>
        set((state) => ({
          history: [analysis, ...state.history].slice(0, 20),
        })),
    }),
    {
      name: "lyzer-storage",
    }
  )
);
