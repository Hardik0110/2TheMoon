import { CoinGeckoResponse, SearchResult } from "@/lib/types";

export const searchCoins = async (query: string): Promise<SearchResult> => {
  if (!query) return { coins: [] };

  const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
}

  export const fetchCoins = async (page = 1, perPage = 50): Promise<CoinGeckoResponse[]> => {
    const params = new URLSearchParams({
      vs_currency: 'inr',
      order: 'market_cap_desc',
      per_page: perPage.toString(),
      page: page.toString(),
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d'
    });

    
  
    const url = `https://api.coingecko.com/api/v3/coins/markets?${params}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
      }
    };

    console.log(url)
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  };

export type { CoinGeckoResponse };
