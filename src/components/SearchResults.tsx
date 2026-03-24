import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, ArrowRight, TrendingUp, TrendingDown, Activity, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { ErrorType } from "./ErrorDisplay";

interface SearchResultsProps {
  query: string;
  onAnalyze: (ticker: string) => void;
  onError: (type: ErrorType, message?: string) => void;
}

export const SearchResults = ({ query, onAnalyze, onError }: SearchResultsProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const marketData = await api.getMarketOverview();
        
        const filtered = marketData.filter((item: any) => 
          item.symbol.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
          try {
            const specific = await api.getStockData(query);
            setResults([{
              symbol: specific.quote.symbol,
              name: specific.quote.shortName || specific.quote.longName,
              price: specific.quote.regularMarketPrice,
              change: specific.quote.regularMarketChange,
              changePercent: specific.quote.regularMarketChangePercent
            }]);
          } catch (e) {
            onError("NOT_FOUND", `The intelligence grid could not locate any assets matching "${query}".`);
          }
        } else {
          setResults(filtered);
        }
      } catch (e) {
        onError("API_ERROR", "The search intelligence node is currently unresponsive.");
      } finally {
        setLoading(false);
      }
    };

    if (query) performSearch();
  }, [query, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-12">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-gold/10 border-t-gold animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={32} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl font-serif text-white italic tracking-wide">Scanning Global Intelligence Nodes...</p>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.4em]">Quantum search in progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <header className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-4 text-gold">
          <div className="w-12 h-[1px] bg-gold/40" />
          <Search size={20} />
          <span className="text-[11px] font-bold uppercase tracking-[0.5em]">Search Intelligence</span>
        </div>
        <h1 className="text-7xl font-serif text-white tracking-tighter leading-[1.1]">
          Results for <span className="gold-text italic">"{query}"</span>
        </h1>
        <p className="text-xl text-zinc-500 font-light tracking-wide">
          Found {results.length} asset{results.length !== 1 ? 's' : ''} matching your inquiry.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {results.map((result, i) => (
          <motion.div
            key={result.symbol}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onAnalyze(result.symbol)}
            className="group cursor-pointer glass-panel p-10 rounded-[3rem] flex items-center justify-between hover:bg-white/[0.04] hover:border-gold/30 transition-all duration-700 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-center gap-10 relative z-10">
              <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] flex items-center justify-center font-serif text-3xl text-zinc-500 group-hover:text-gold transition-all duration-500 border border-white/5">
                {result.symbol[0]}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-serif text-white tracking-tighter group-hover:gold-text transition-colors">{result.symbol}</span>
                  <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest border border-gold/20">Verified Asset</span>
                </div>
                <span className="text-sm text-zinc-500 font-light tracking-widest uppercase">{result.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-16 relative z-10">
              <div className="flex flex-col items-end gap-2 text-right">
                <span className="text-4xl font-serif text-white">${result.price?.toLocaleString()}</span>
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                  result.change >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                }`}>
                  {result.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(result.changePercent || 0).toFixed(2)}%
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                <ArrowRight size={24} className="text-zinc-600 group-hover:text-gold transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="p-16 rounded-[4rem] bg-gold/[0.03] border border-gold/10 flex items-center justify-between group relative overflow-hidden emerald-glow">
          <div className="absolute inset-0 bg-emerald-950/10 opacity-50" />
          <div className="flex items-center gap-10 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 flex items-center justify-center text-gold">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-white italic">Deep Intelligence Synthesis</h3>
              <p className="text-lg text-zinc-500 font-light">Perform a full AI-powered analysis on any of these assets.</p>
            </div>
          </div>
          <button className="luxury-button gold-gradient text-black border-none px-12 py-4 text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-transform relative z-10">
            Begin Global Scan
          </button>
        </div>
      )}
    </div>
  );
};
