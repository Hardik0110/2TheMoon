import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useCoinsQuery } from '../api/api';
import Pagination from './Pagination';
import { Coin } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

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
        <div className="flex items-center space-x-3">
          <img 
            src={info.row.original.image} 
            alt={info.getValue()} 
            className="w-6 h-6 rounded-full"
          />
          <div className="flex items-center space-x-2">
            <span>{info.getValue()}</span>
            <span className="text-gray-400">{info.row.original.symbol}</span>
          </div>
        </div>
      ),
    }),
  columnHelper.accessor('price', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        Price {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('change1h', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        1h {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('change24h', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        24h {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('change7d', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        7d {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => <PriceChangeCell value={info.getValue()} />,
  }),
  columnHelper.accessor('volume24h', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        24h Volume {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('marketCap', {
    header: ({ column }) => (
      <div 
        className="cursor-pointer flex items-center gap-1" 
        onClick={() => column.toggleSorting()}>
        Market Cap {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
];

const CoinTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sorting, setSorting] = useState<SortingState>([]);
  const totalCoins = 17145; 

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    isFetching 
  } = useCoinsQuery(currentPage, pageSize);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
    table.setPageIndex(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    table.setPageSize(newSize);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="text-red-500 text-center p-4">
          Error loading data: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm relative">
      {isFetching && (
        <div className="absolute top-0 left-0 right-0 h-1">
          <div className="h-full bg-blue-500/50 animate-pulse" />
        </div>
      )}
      <CardContent className="flex-1 overflow-y-auto px-0">
        <table className="w-full border-separate border-spacing-y-2">
          <thead className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-5 text-left text-sm font-medium text-blue-300 border-b-2 border-blue-500/20"
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
                className="cursor-pointer transition-all duration-200 bg-blue-900/5 hover:bg-indigo-900 hover:transform"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-4 text-sm text-gray-200 first:rounded-l-lg last:rounded-r-lg"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <div className="">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCoins / pageSize)}
          pageSize={pageSize}
          totalResults={totalCoins}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          canPreviousPage={currentPage > 1}
          canNextPage={currentPage * pageSize < totalCoins}
          previousPage={() => handlePageChange(currentPage - 2)}
          nextPage={() => handlePageChange(currentPage)}
        />
      </div>
    </Card>
  );
};

export default CoinTable;