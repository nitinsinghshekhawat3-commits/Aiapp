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

    const summary: any = await yahooFinance.quoteSummary(ticker, {
      modules: [
        "summaryDetail",
        "financialData",
        "defaultKeyStatistics",
        "assetProfile",
      ],
    });

    res.status(200).json({ quote, summary });
  } catch (error) {
    console.error("Stock raw fetch error:", error);
    res.status(500).json({ error: "Failed to fetch stock raw data" });
  }
}