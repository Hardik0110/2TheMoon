import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fetchCoins, CoinGeckoResponse } from '../api/api';
import Pagination from './Pagination';

interface Coin {
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
}

const columnHelper = createColumnHelper<Coin>();

const PriceChangeCell = ({ value }: { value: number | null }) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">--</span>;
  }
  
  const color = value >= 0 ? 'text-green-400' : 'text-red-400';
  const prefix = value >= 0 ? '+' : '';
  return <span className={color}>{prefix}{value.toFixed(2)}%</span>;
};

const columns = [
  columnHelper.accessor('rank', {
    header: '#',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Coin',
    cell: (info) => (
      <div className="flex items-center space-x-2">
        <span>{info.getValue()}</span>
        <span className="text-gray-400">{info.row.original.symbol}</span>
      </div>
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('change1h', {
    header: '1h',
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('change24h', {
    header: '24h',
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('change7d', {
    header: '7d',
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('volume24h', {
    header: '24h Volume',
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('marketCap', {
    header: 'Market Cap',
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
];

const CoinTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(50);
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const [totalCoins, setTotalCoins] = useState(17145);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        setLoading(true);
        const response = await fetchCoins(currentApiPage, pageSize);
        const formattedData: Coin[] = response.map((coin: CoinGeckoResponse) => ({
          id: coin.id,
          rank: coin.market_cap_rank,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price || 0,
          change1h: coin.price_change_percentage_1h_in_currency || null,
          change24h: coin.price_change_percentage_24h || null,
          change7d: coin.price_change_percentage_7d || null,
          volume24h: coin.total_volume || 0,
          marketCap: coin.market_cap || 0,
        }));
        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, [currentApiPage, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;

  const handlePageChange = (newPage: number) => {
    setCurrentApiPage(newPage + 1);
    table.setPageIndex(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentApiPage(1); // Reset to first page when changing page size
    table.setPageSize(newSize);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-lg p-6 backdrop-blur-sm border border-blue-500/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-blue-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => navigate(`/coin/${row.original.id}`)}
                className="cursor-pointer hover:bg-purple-900/20 transition-colors border-b border-purple-500/10"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentApiPage}
        totalPages={Math.ceil(totalCoins / pageSize)}
        pageSize={pageSize}
        totalResults={totalCoins}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        canPreviousPage={currentApiPage > 1}
        canNextPage={currentApiPage * pageSize < totalCoins}
        previousPage={() => handlePageChange(currentApiPage - 2)}
        nextPage={() => handlePageChange(currentApiPage)}
      />
    </div>
  );
};

export default CoinTable;