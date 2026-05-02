import { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker parameter is required' });
  }

  try {
    const quote: any = await yahooFinance.quote(ticker);

    const chart: any = await yahooFinance.chart(ticker, {
      period1: "2024-01-01",
      interval: "1d",
    });

    res.status(200).json({ quote, chart: chart.quotes });
  } catch (error: any) {
    console.error("Stock fetch error:", error);

    if (error.message && error.message.includes("No data found")) {
      return res.status(404).json({ error: "No data found, symbol may be delisted" });
    }

    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}