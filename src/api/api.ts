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
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'false',
    price_change_percentage: '1h,24h,7d,30d', // Update this line
  });

  const url = `https://api.coingecko.com/api/v3/coins/markets?${params}`;
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
    console.error('Error fetching coins:', error);
    throw error;
  }
};

export interface CoinDetails extends CoinGeckoResponse {
  description: { en: string };
  market_data: {
    current_price: { [key: string]: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };
}

export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;
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
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export type { CoinGeckoResponse };
