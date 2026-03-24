import React from "react";
import { motion } from "motion/react";
import { AlertCircle, WifiOff, Clock, SearchX, Ban, FileQuestion } from "lucide-react";

export type ErrorType = "NOT_FOUND" | "API_ERROR" | "RATE_LIMIT" | "NETWORK_ERROR" | "INVALID_QUERY" | "EMPTY_RESULTS";

interface ErrorDisplayProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
}

const errorConfig = {
  NOT_FOUND: {
    icon: SearchX,
    title: "No Results Found",
    description: "We couldn't find anything matching your search criteria. Please try a different term.",
    color: "text-amber-500"
  },
  API_ERROR: {
    icon: AlertCircle,
    title: "Intelligence Interrupted",
    description: "Our core intelligence systems are experiencing a brief disturbance. We are working to restore full connectivity.",
    color: "text-rose-500"
  },
  RATE_LIMIT: {
    icon: Clock,
    title: "Pace Exceeded",
    description: "You've reached the current limit of our intelligence processing. Please pause for a moment before continuing.",
    color: "text-blue-500"
  },
  NETWORK_ERROR: {
    icon: WifiOff,
    title: "Connectivity Lost",
    description: "The bridge between your location and our servers has been interrupted. Please check your connection.",
    color: "text-zinc-500"
  },
  INVALID_QUERY: {
    icon: Ban,
    title: "Refinement Required",
    description: "The search parameters provided do not meet our intelligence standards. Please refine your query.",
    color: "text-orange-500"
  },
  EMPTY_RESULTS: {
    icon: FileQuestion,
    title: "Void Encountered",
    description: "The search was successful, but the requested data set appears to be empty at this time.",
    color: "text-zinc-400"
  }
};

export const ErrorDisplay = ({ type, message, onRetry }: ErrorDisplayProps) => {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-16 text-center glass-panel rounded-[3rem] max-w-2xl mx-auto mt-20 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className={`w-24 h-24 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-10 relative z-10 ${config.color}`}>
        <Icon size={48} strokeWidth={1} className="animate-pulse" />
      </div>
      
      <div className="relative z-10 space-y-6">
        <h2 className="text-5xl font-serif text-white tracking-tighter italic">{config.title}</h2>
        <p className="text-xl text-zinc-500 font-light leading-relaxed max-w-md mx-auto">
          {message || config.description}
        </p>
        
        {onRetry && (
          <div className="pt-8">
            <button
              onClick={onRetry}
              className="luxury-button gold-gradient text-black border-none px-12 py-4 text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-transform"
            >
              Attempt Reconnection
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
