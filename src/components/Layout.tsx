import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  History, 
  Settings, 
  TrendingUp, 
  Menu,
  X,
  Bell,
  User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 w-full px-6 py-4 transition-all duration-500 group relative",
      active 
        ? "text-gold" 
        : "text-zinc-500 hover:text-zinc-200"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-nav"
        className="absolute left-0 w-1 h-8 bg-gold rounded-r-full shadow-[0_0_15px_rgba(197,160,89,0.5)]"
      />
    )}
    <Icon size={20} className={cn("transition-transform duration-500 group-hover:scale-110", active && "text-gold")} />
    <span className="font-serif text-base tracking-wide">{label}</span>
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-2xl border-r border-white/5 z-50">
      <div className="flex flex-col h-full py-10">
        <div className="flex items-center gap-4 px-8 mb-16">
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shadow-2xl shadow-gold/20">
            <TrendingUp className="text-black" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-tighter text-white">AURA</span>
            <span className="text-[9px] font-bold text-gold tracking-[0.3em] uppercase opacity-80">Intelligence</span>
          </div>
        </div>

        <nav className="flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Intelligence" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <SidebarItem 
            icon={Search} 
            label="Search Results" 
            active={activeTab === "search"} 
            onClick={() => setActiveTab("search")} 
          />
          <SidebarItem 
            icon={TrendingUp} 
            label="Deep Analysis" 
            active={activeTab === "analyzer"} 
            onClick={() => setActiveTab("analyzer")} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="Assets" 
            active={activeTab === "portfolio"} 
            onClick={() => setActiveTab("portfolio")} 
          />
          <SidebarItem 
            icon={History} 
            label="Chronicle" 
            active={activeTab === "history"} 
            onClick={() => setActiveTab("history")} 
          />
        </nav>

        <div className="px-6 pt-10 border-t border-white/5">
          <SidebarItem 
            icon={Settings} 
            label="Preferences" 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")} 
          />
        </div>
      </div>
    </aside>
  );
};

export const Layout = ({ children, activeTab, setActiveTab, onSearch }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void, onSearch: (ticker: string) => void }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 selection:bg-gold/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 transition-all duration-500 min-h-screen">
        <header className="sticky top-0 z-40 h-24 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-12 flex items-center justify-between">
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold transition-colors" size={20} />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search assets, tickers, or intelligence..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-14 pr-6 py-3 focus:border-gold/40 focus:bg-white/[0.05] outline-none transition-all duration-500 text-sm font-light tracking-wide"
            />
          </form>

          <div className="flex items-center gap-8 ml-12">
            <button className="relative p-2 text-zinc-400 hover:text-gold transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
            </button>
            <div className="flex items-center gap-4 pl-8 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-serif text-white">Nitin Singh</span>
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest opacity-60">Prestige Member</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-gold/30 p-0.5">
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
};
