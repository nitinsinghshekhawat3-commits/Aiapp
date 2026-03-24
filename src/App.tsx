import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { StockAnalyzer } from "./components/StockAnalyzer";
import { Portfolio, HistoryView } from "./components/Portfolio";
import { ErrorDisplay, ErrorType } from "./components/ErrorDisplay";

import { SearchResults } from "./components/SearchResults";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicker, setSelectedTicker] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState<{ type: ErrorType; message?: string } | null>(null);

  const handleAnalyze = (ticker: string) => {
    if (!ticker.trim()) {
      setError({ type: "INVALID_QUERY", message: "Please enter a valid ticker symbol to begin analysis." });
      return;
    }
    setError(null);
    setSelectedTicker(ticker.toUpperCase());
    setActiveTab("analyzer");
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setError({ type: "INVALID_QUERY", message: "Please enter a search term to explore our intelligence grid." });
      return;
    }
    setError(null);
    setSearchQuery(query);
    setActiveTab("search");
  };

  const renderContent = () => {
    if (error) {
      return <ErrorDisplay type={error.type} message={error.message} onRetry={() => setError(null)} />;
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard onAnalyze={handleAnalyze} />;
      case "analyzer":
        return <StockAnalyzer initialTicker={selectedTicker} onError={(type, msg) => setError({ type, message: msg })} />;
      case "search":
        return <SearchResults query={searchQuery || ""} onAnalyze={handleAnalyze} onError={(type, msg) => setError({ type, message: msg })} />;
      case "portfolio":
        return <Portfolio />;
      case "history":
        return <HistoryView onAnalyze={handleAnalyze} />;
      default:
        return <Dashboard onAnalyze={handleAnalyze} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onSearch={handleSearch}>
      {renderContent()}
    </Layout>
  );
}
