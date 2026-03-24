import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Bot, User, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { api } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIChat = ({ onClose, context }: { onClose: () => void, context: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Greetings. I am Aura, your strategic intelligence agent. I have synthesized a deep analysis for ${context.ticker}. How may I further assist your market research?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await api.chat(userMsg, context);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered a disturbance in my intelligence grid. Please attempt your query again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-8 right-8 w-[450px] h-[650px] bg-[#050505] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-[100] overflow-hidden backdrop-blur-2xl"
    >
      <header className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shadow-2xl shadow-gold/20">
            <Sparkles className="text-black" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl text-white tracking-tight">AURA AI</span>
            <span className="text-[9px] font-bold text-gold uppercase tracking-[0.3em] opacity-80">Intelligence Agent</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === "user" ? "bg-white/5 border-white/10" : "bg-gold/10 border-gold/20"}`}>
              {msg.role === "user" ? <User size={18} className="text-zinc-400" /> : <Bot size={18} className="text-gold" />}
            </div>
            <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed font-light tracking-wide ${msg.role === "user" ? "bg-white/5 text-zinc-100 rounded-tr-none border border-white/10" : "bg-zinc-900/50 text-zinc-300 border border-white/5 rounded-tl-none font-serif italic"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Loader2 size={18} className="text-gold animate-spin" />
            </div>
            <div className="bg-zinc-900/50 p-5 rounded-3xl rounded-tl-none border border-white/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-8 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire further about this analysis..."
            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-gold/50 outline-none transition-all text-sm font-light text-white placeholder:text-zinc-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl gold-gradient text-black hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-gold/10"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
