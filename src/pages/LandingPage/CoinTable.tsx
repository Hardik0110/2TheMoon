import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Coin, SortState, SortOption } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/Pagination';
import { useCoinsData } from '@/lib/hooks/useCoinsData';
import { useGlobalData } from '@/lib/hooks/useGlobalData';
import {  formatCurrency } from '@/lib/utils';

const columnHelper = createColumnHelper<Coin>();

const PriceChangeCell = ({ value }: { value: number | null }) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">Null</span>;
  }
  
  const color = value >= 0 ? 'text-green-400' : 'text-red-400';
  const prefix = value >= 0 ? '+' : '';
  return <span className={color}>{prefix}{value.toFixed(2)}%</span>;
};

const CoinTable = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortState | undefined>(undefined);

  const { data, isLoading, error } = useCoinsData({
    page: currentPage,
    pageSize,
    sort: sorting
  });

  const { data: totalCoins = 0 } = useGlobalData();

  const handleSortingChange = (updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater([]) : updater;
    
    if (newSorting.length === 0) {
      setSorting(undefined);
      return;
    }

    const { id, desc } = newSorting[0];
    setSorting({
      sortBy: mapColumnToApiSort(id),
      sortDirection: desc ? 'desc' : 'asc'
    });
  };

  const columns = [
    columnHelper.accessor('rank', {
      header: '#',
      cell: (info) => info.getValue(),
      size: 70,
    }),
    columnHelper.accessor('name', {
      header: 'Coin',
      cell: (info) => (
        <div className="flex items-center space-x-3 min-w-[200px]">
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
      size: 200,
    }),
    columnHelper.accessor('price', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          Price {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right">{formatCurrency(info.getValue())}</div>,
      size: 130,
      enableSorting: true,
    }),
    columnHelper.accessor('change1h', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          1h {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right"><PriceChangeCell value={info.getValue()} /></div>,
      size: 100,
      enableSorting: true,
    }),
    columnHelper.accessor('change24h', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          24h {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right"><PriceChangeCell value={info.getValue()} /></div>,
      size: 100,
      enableSorting: true,
    }),
    columnHelper.accessor('change7d', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          7d {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right"><PriceChangeCell value={info.getValue()} /></div>,
      size: 100,
      enableSorting: true,
    }),
    columnHelper.accessor('volume24h', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          24h Volume {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right">{formatCurrency(info.getValue())}</div>,
      size: 150,
      enableSorting: true,
    }),
    columnHelper.accessor('marketCap', {
      header: ({ column }) => (
        <div className="text-right cursor-pointer flex items-center justify-end gap-1" 
          onClick={() => column.toggleSorting()}>
          Market Cap {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: (info) => <div className="text-right">{formatCurrency(info.getValue())}</div>,
      size: 150,
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting: sorting ? [{ id: sorting.sortBy, desc: sorting.sortDirection === 'desc' }] : [],
    },
    manualSorting: true,
    manualPagination: true,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm h-[calc(100vh-120px)] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm h-[calc(100vh-120px)] flex flex-col">
        <CardContent className="text-red-500 text-center p-4">
          Error loading data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm h-[calc(95vh-120px)] flex flex-col">
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-blue-500/20">
            <Table className="w-full table-fixed">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="px-6 py-5 text-left text-sm font-medium text-blue-300 whitespace-nowrap"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>
  
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-blue-900/20 scrollbar-thumb-blue-500/20">
            <Table className="w-full table-fixed">
              <TableBody>
                {data && data.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => navigate(`/coin/${row.original.id}`)}
                      className="cursor-pointer transition-all duration-200 bg-blue-900/5 hover:bg-indigo-900 hover:transform"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="px-4 py-4 text-sm text-gray-200 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-gray-400">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>                                                                              
            </Table>
          </div>
        </div>
      </CardContent>
  
      <div className="p-2 border-t border-blue-500/20 ">
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

const mapColumnToApiSort = (columnId: string): SortOption => {
  const map: Record<string, SortOption> = {
    'price': 'current_price',
    'marketCap': 'market_cap',
    'volume24h': 'volume',
    'change1h': 'price_change_percentage_1h_in_currency',
    'change24h': 'price_change_percentage_24h',
    'change7d': 'price_change_percentage_7d_in_currency',
  };
  return map[columnId] || 'market_cap';
};

export default CoinTable;