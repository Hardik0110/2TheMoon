export interface CoinGeckoResponse {
    id: string;
    market_cap_rank: number;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    total_volume: number;
    market_cap: number;
    image: string;
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
    [key: string]: string | number | null; 
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
  
  export interface FilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    timeFrame: string;
    onTimeFrameChange: (value: string) => void;
  }

  export interface SearchResult {
    coins: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      large: string;
    }[];
  } 