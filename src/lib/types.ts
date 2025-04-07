import { ReactNode } from 'react';

export interface CoinGeckoResponse {
  id: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  price_change_percentage_30d_in_currency: number | null;
  total_volume: number;
  market_cap: number;
}

export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number | null;
  change24h: number | null;
  change7d: number | null;
  volume24h: number;
  marketCap: number;
  image: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalResults: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (newSize: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
}

export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }>;
}

export type SortOption = 
  | 'market_cap' 
  | 'volume' 
  | 'id' 
  | 'current_price'
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  sortBy: SortOption;
  sortDirection: SortDirection;
}

export interface CoinTableQueryParams {
  page: number;
  pageSize: number;
  sort?: SortState;
}

export interface CoinDetails {
  market_cap_rank: ReactNode;
  id: string;
  name: string;
  symbol: string;
  description: { en: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  image: { large: string };
}