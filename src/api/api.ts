import { useQuery } from '@tanstack/react-query';
import { CoinGeckoResponse, SearchResult } from "@/lib/types";

const API_KEY = 'CG-4PWJabzm45BiqTTxFHaW2kcJ';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const defaultOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': API_KEY
  }
};

export const searchCoins = async (query: string): Promise<SearchResult> => {
  if (!query) return { coins: [] };

  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
}

export const fetchCoins = async ({ 
  pageParam = 1, 
  pageSize = 50 
}): Promise<CoinGeckoResponse[]> => {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: pageSize.toString(),
    page: pageParam.toString(),
    sparkline: 'false',
    price_change_percentage: '1h,24h,7d'
  });

  const url = `${BASE_URL}/coins/markets?${params}`;

  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

export const useCoinsQuery = (page: number, pageSize: number) => {
  return useQuery<CoinGeckoResponse[], Error>({
    queryKey: ['coins', page, pageSize],
    queryFn: () => fetchCoins({ pageParam: page, pageSize }),
    placeholderData: 'keepPreviousData',
    staleTime: 1000 * 60, 
    cacheTime: 1000 * 60 * 5, 
  });
};

export const useSearchCoinsQuery = (query: string) => {
  return useQuery<SearchResult, Error>({
    queryKey: ['search', query],
    queryFn: () => searchCoins(query),
    enabled: !!query,
    staleTime: 1000 * 30, 
    cacheTime: 1000 * 60 * 5, 
  });
};

export type { CoinGeckoResponse };

