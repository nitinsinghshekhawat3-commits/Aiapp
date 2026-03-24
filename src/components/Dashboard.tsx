import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Trash2, Sparkles, Globe, ShieldCheck, Zap } from "lucide-react";
import { api } from "../lib/api";
import { useStore } from "../store/useStore";

const MarketCard = ({ index }: any) => {
  const isPositive = index?.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 rounded-[3rem] glass-panel flex flex-col gap-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-zinc-500">{index?.name}</span>
          <div className="text-sm text-zinc-600">{index?.symbol}</div>
        </div>

        <div className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
        </div>
      </div>

      <div>
        <div className="text-3xl text-white">
          ${index?.price?.toFixed(2) || "0.00"}
        </div>

        <div className={isPositive ? "text-green-400" : "text-red-400"}>
          {index?.changePercent?.toFixed(2) || "0.00"}%
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard = ({ onAnalyze }: { onAnalyze: (ticker: string) => void }) => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { watchlist, removeFromWatchlist } = useStore();

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const data = await api.getMarketOverview();

        console.log("API Response:", data);

        // ✅ SAFE HANDLING
        if (Array.isArray(data)) {
          setMarketData(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setMarketData(data.data);
        } else {
          setMarketData([]);
        }
      } catch (e) {
        console.error("API Error:", e);
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  return (
    <div className="space-y-20">

      {/* HEADER */}
      <header>
        <h1 className="text-4xl text-white">Market Dashboard</h1>
      </header>

      {/* MARKET SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : Array.isArray(marketData) && marketData.length > 0 ? (

          marketData.map((index) => (
            <MarketCard key={index.symbol} index={index} />
          ))

        ) : (
          <div className="text-white col-span-5 text-center">
            ⚠️ No market data available
          </div>
        )}

      </section>

      {/* WATCHLIST */}
      <section>
        <h2 className="text-2xl text-white mb-4">Watchlist</h2>

        {watchlist.length === 0 ? (
          <p className="text-zinc-500">No stocks added</p>
        ) : (
          watchlist.map((ticker) => (
            <div key={ticker} className="flex justify-between text-white mb-2">
              <span>{ticker}</span>

              <div className="flex gap-2">
                <button onClick={() => onAnalyze(ticker)}>Analyze</button>
                <button onClick={() => removeFromWatchlist(ticker)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

    </div>
  );
};