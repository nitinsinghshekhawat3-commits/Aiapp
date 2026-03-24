import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Target, 
  BarChart3, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Plus
} from "lucide-react";
import { api, ApiError, ErrorType } from "../lib/api";
import { TradingViewChart } from "./TradingViewChart";
import { useStore } from "../store/useStore";
import { AIChat } from "./AIChat";

interface StockAnalyzerProps {
  initialTicker?: string;
  onError?: (type: ErrorType, message: string) => void;
}

export const StockAnalyzer = ({ initialTicker, onError }: StockAnalyzerProps) => {
  const [ticker, setTicker] = useState(initialTicker || "");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const { addHistory, addToWatchlist, watchlist } = useStore();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!ticker.trim()) {
      onError?.("INVALID_QUERY", "Please enter a valid ticker symbol to begin analysis.");
      return;
    }
    
    setLoading(true);
    setAnalysis(null);
    setStockData(null);

    try {
      const [data, result] = await Promise.all([
        api.getStockData(ticker),
        api.analyzeStock(ticker)
      ]);
      setStockData(data);
      setAnalysis(result);
      addHistory({ ticker, timestamp: new Date().toISOString(), result });
    } catch (err: any) {
      console.error(err);
      if (err instanceof ApiError) {
        onError?.(err.type, err.message);
      } else {
        onError?.("API_ERROR", "An unexpected error occurred during intelligence synthesis.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicker) {
      setTicker(initialTicker);
      handleSearch();
    }
  }, [initialTicker]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-emerald-500 bg-emerald-500/10";
      case "Medium": return "text-amber-500 bg-amber-500/10";
      case "High": return "text-rose-500 bg-rose-500/10";
      default: return "text-zinc-500 bg-zinc-500/10";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Buy": return <CheckCircle2 className="text-emerald-500" />;
      case "Hold": return <AlertTriangle className="text-amber-500" />;
      case "Avoid": return <XCircle className="text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-16">
      <header className="flex flex-col gap-8 max-w-4xl">
        <div className="flex items-center gap-4 text-gold">
          <div className="w-12 h-[1px] bg-gold/40" />
          <TrendingUp size={20} />
          <span className="text-[11px] font-bold uppercase tracking-[0.5em]">Deep Asset Analysis</span>
        </div>
        <h1 className="text-7xl font-serif text-white tracking-tighter leading-[1.1]">
          Institutional <span className="gold-text italic">Intelligence</span> <br />
          at your fingertips.
        </h1>
        
        <form onSubmit={handleSearch} className="flex gap-6 max-w-2xl mt-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-gold transition-colors" size={20} />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker symbol (e.g. AAPL)..."
              className="luxury-input pl-16 pr-32"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="luxury-button bg-gold text-black border-none hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Begin Scan"}
          </button>
        </form>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 flex flex-col items-center justify-center gap-10"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gold/10 border-t-gold animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={32} />
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-2xl font-serif text-white italic tracking-wide">Aura is synthesizing market nodes...</p>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.4em]">Quantum analysis in progress</p>
            </div>
          </motion.div>
        ) : analysis ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 glass-panel p-12 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-gold/10 transition-all duration-1000" />
                
                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <h2 className="text-6xl font-serif text-white tracking-tighter">{ticker}</h2>
                      <span className="px-4 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest border border-gold/20">Verified Asset</span>
                    </div>
                    <p className="text-xl text-zinc-500 font-light tracking-wide">{analysis.stock_name}</p>
                  </div>
                  <button
                    onClick={() => addToWatchlist(ticker)}
                    disabled={watchlist.includes(ticker)}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-500 hover:text-gold hover:border-gold/40 transition-all duration-500 disabled:text-gold disabled:bg-gold/5"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Current Value</span>
                    <p className="text-3xl font-serif text-white">${stockData?.quote?.regularMarketPrice?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Market Cap</span>
                    <p className="text-3xl font-serif text-white">${(stockData?.quote?.marketCap / 1e12).toFixed(2)}T</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">P/E Ratio</span>
                    <p className="text-3xl font-serif text-white">{stockData?.quote?.trailingPE?.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">52W Range</span>
                    <p className="text-3xl font-serif text-white">${stockData?.quote?.fiftyTwoWeekLow?.toLocaleString()} - ${stockData?.quote?.fiftyTwoWeekHigh?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-12 glass-panel rounded-3xl overflow-hidden p-1">
                  {stockData?.chart && <TradingViewChart data={stockData.chart} />}
                </div>
              </div>

              <div className="glass-panel p-12 rounded-[3rem] flex flex-col justify-between relative overflow-hidden group emerald-glow">
                <div className="absolute inset-0 bg-emerald-950/20 opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.5em] mb-8">Aura Intelligence Verdict</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {getVerdictIcon(analysis.final_verdict)}
                      <span className={`text-6xl font-serif italic tracking-tighter ${
                        analysis.final_verdict === 'Buy' ? 'text-emerald-500' : 
                        analysis.final_verdict === 'Avoid' ? 'text-rose-500' : 'text-zinc-400'
                      }`}>
                        {analysis.final_verdict}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed">
                      Our synthesis engine has processed over 10,000 data points to arrive at this conclusion.
                    </p>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 relative z-10 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Confidence Score</span>
                    <span className="text-gold font-mono text-sm">{(analysis.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.confidence_score * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full gold-gradient rounded-full" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Risk Profile</span>
                    <span className={`px-4 py-1 rounded-full font-medium text-[10px] tracking-wider uppercase ${getRiskColor(analysis.risk_level)}`}>
                      {analysis.risk_level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-panel p-12 rounded-[3rem] space-y-10 border-emerald-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Growth Catalysts</h3>
                </div>
                <ul className="space-y-6">
                  {analysis.bull_case.map((item: string, i: number) => (
                    <li key={i} className="flex gap-6 group">
                      <span className="text-emerald-500/40 font-mono text-sm mt-1">0{i + 1}</span>
                      <p className="text-zinc-400 font-light leading-relaxed group-hover:text-zinc-200 transition-colors">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-12 rounded-[3rem] space-y-10 border-rose-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <TrendingDown size={24} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Risk Vectors</h3>
                </div>
                <ul className="space-y-6">
                  {analysis.bear_case.map((item: string, i: number) => (
                    <li key={i} className="flex gap-6 group">
                      <span className="text-rose-500/40 font-mono text-sm mt-1">0{i + 1}</span>
                      <p className="text-zinc-400 font-light leading-relaxed group-hover:text-zinc-200 transition-colors">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-panel p-16 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                  <Sparkles size={14} />
                  Deep Intelligence Synthesis
                </div>
                <h3 className="text-5xl font-serif text-white tracking-tighter leading-tight">
                  Ready to explore the <br />
                  <span className="gold-text italic">Quantum Future</span> of this asset?
                </h3>
                <p className="text-xl text-zinc-500 font-light leading-relaxed">
                  Engage with Aura AI to ask specific questions about {ticker}'s market position, 
                  competitive landscape, and future trajectory.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => setShowChat(true)}
                    className="luxury-button gold-gradient text-black border-none px-12 py-4 text-sm tracking-[0.2em] uppercase flex items-center gap-4 mx-auto hover:scale-105 transition-transform"
                  >
                    Consult Aura Intelligence
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto mb-10">
              <Search size={40} className="text-zinc-800" />
            </div>
            <h2 className="text-4xl font-serif text-zinc-700 tracking-tight italic">Awaiting Intelligence Parameters</h2>
            <p className="text-zinc-600 font-light tracking-widest uppercase text-[10px]">Enter a ticker symbol above to begin global synthesis</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showChat && analysis && (
        <AIChat 
          onClose={() => setShowChat(false)} 
          context={{ ticker, analysis, stockData }} 
        />
      )}
    </div>
  );
};
