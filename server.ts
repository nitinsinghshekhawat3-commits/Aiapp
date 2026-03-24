import express from "express";
import cors from "cors";
import path from "path";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new (YahooFinance as any)();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors()); // ✅ IMPORTANT (frontend connection fix)
  app.use(express.json());

  // ✅ MARKET OVERVIEW
  app.get("/api/market-overview", async (req, res) => {
    try {
      const indices = ["^GSPC", "^IXIC", "^NSEI", "^FTSE", "BTC-USD"];

      const results = await Promise.all(
        indices.map(async (symbol) => {
          const quote: any = await yahooFinance.quote(symbol);

          return {
            symbol,
            name: quote.shortName || symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
          };
        })
      );

      res.json(results);
    } catch (error) {
      console.error("Market overview error:", error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // ✅ STOCK DETAILS
  app.get("/api/stock/:ticker", async (req, res) => {
    const { ticker } = req.params;

    try {
      const quote: any = await yahooFinance.quote(ticker);

      const chart: any = await yahooFinance.chart(ticker, {
        period1: "2024-01-01",
        interval: "1d",
      });

      res.json({ quote, chart: chart.quotes });
    } catch (error: any) {
      console.error("Stock fetch error:", error);

      if (error.message && error.message.includes("No data found")) {
        return res
          .status(404)
          .json({ error: "No data found, symbol may be delisted" });
      }

      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  // ✅ RAW STOCK DATA (AI use)
  app.get("/api/stock-raw/:ticker", async (req, res) => {
    const { ticker } = req.params;

    try {
      const quote: any = await yahooFinance.quote(ticker);

      const summary: any = await yahooFinance.quoteSummary(ticker, {
        modules: [
          "summaryDetail",
          "financialData",
          "defaultKeyStatistics",
          "assetProfile",
        ],
      });

      res.json({ quote, summary });
    } catch (error) {
      console.error("Stock raw fetch error:", error);
      res.status(500).json({ error: "Failed to fetch stock raw data" });
    }
  });

  // ✅ START SERVER
  app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
  });
}

startServer();