import React from "react";
import { motion } from "motion/react";
import { Briefcase, TrendingUp, TrendingDown, Plus, Trash2, PieChart, Activity } from "lucide-react";
import { useStore } from "../store/useStore";

export const Portfolio = () => {
  const { portfolio, removeFromPortfolio } = useStore();

  const totalValue = portfolio.reduce((acc, item) => acc + item.shares * item.avgPrice, 0);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Portfolio Tracker</h1>
        <p className="text-zinc-400 font-medium">Monitor your holdings and risk distribution.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Value</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</span>
            <span className="text-emerald-500 text-sm font-bold">+12.4%</span>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Day P&L</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-500">+$1,240</span>
            <span className="text-emerald-500 text-sm font-bold">+2.1%</span>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Risk Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-500">Medium</span>
            <span className="text-zinc-500 text-sm font-bold">Balanced</span>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-emerald-500" />
            Holdings
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all">
            <Plus size={18} />
            Add Asset
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/30">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Shares</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg Price</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Current</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">P&L</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 font-medium">
                    No holdings found. Add your first asset to start tracking.
                  </td>
                </tr>
              ) : (
                portfolio.map((item) => (
                  <tr key={item.ticker} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 group-hover:text-emerald-500 transition-colors">
                          {item.ticker[0]}
                        </div>
                        <span className="font-bold text-white">{item.ticker}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-300">{item.shares}</td>
                    <td className="px-6 py-4 font-medium text-zinc-300">${item.avgPrice}</td>
                    <td className="px-6 py-4 font-medium text-zinc-300">$192.40</td>
                    <td className="px-6 py-4 font-bold text-emerald-500">+$420.00</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => removeFromPortfolio(item.ticker)}
                        className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const HistoryView = ({ onAnalyze }: { onAnalyze: (ticker: string) => void }) => {
  const { history } = useStore();

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Analysis History</h1>
        <p className="text-zinc-400 font-medium">Review your past AI-powered stock evaluations.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {history.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-medium border border-dashed border-zinc-800 rounded-3xl">
            No analysis history found.
          </div>
        ) : (
          history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-all">
                  {item.ticker[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg">{item.ticker}</span>
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                    Analyzed on {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Verdict</span>
                  <span className={`font-bold ${item.result.final_verdict === "Buy" ? "text-emerald-500" : item.result.final_verdict === "Hold" ? "text-amber-500" : "text-rose-500"}`}>
                    {item.result.final_verdict}
                  </span>
                </div>
                <button 
                  onClick={() => onAnalyze(item.ticker)}
                  className="px-6 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all"
                >
                  View Report
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
