import { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json(results);
  } catch (error) {
    console.error("Market overview error:", error);
    res.status(500).json({ error: "Failed to fetch market overview" });
  }
}