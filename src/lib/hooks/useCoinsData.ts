import { useQuery } from '@tanstack/react-query';
import { fetchCoins } from '@/api/api';
import type { CoinTableQueryParams, Coin } from '@/lib/types';

export function useCoinsData(params: CoinTableQueryParams) {
  return useQuery({
    queryKey: ['coins', params.page, params.pageSize, params.sort],
    queryFn: async () => {
      const response = await fetchCoins(
        params.page,
        params.pageSize,
        params.sort?.sortBy,
        params.sort?.sortDirection
      );
      
      return response.map((coin): Coin => ({
        id: coin.id,
        rank: coin.market_cap_rank,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        price: coin.current_price || 0,
        change1h: coin.price_change_percentage_1h_in_currency,
        change24h: coin.price_change_percentage_24h,
        change7d: coin.price_change_percentage_7d_in_currency,
        volume24h: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
      }));
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
}