import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel,
        getSortedRowModel, SortingState, useReactTable, } from '@tanstack/react-table';                   
import { fetchCoins, CoinGeckoResponse } from '../../api/api';
import { Coin } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead,  TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '../../components/Pagination';

const columnHelper = createColumnHelper<Coin>();

const PriceChangeCell = ({ value }: { value: number | null }) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">Null</span>;
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
    const [data, setData] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState(50);
    const [currentApiPage, setCurrentApiPage] = useState(1);
    const totalCoins = 17145;
    const [sorting, setSorting] = useState<SortingState>([]);
  
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
            image: coin.image,
            price: coin.current_price || 0,
            change1h: coin.price_change_percentage_1h_in_currency || null,
            change24h: coin.price_change_percentage_24h || null,
            change7d: coin.price_change_percentage_7d_in_currency || null,
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
      setCurrentApiPage(newPage + 1);
      table.setPageIndex(newPage);
    };
  
    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setCurrentApiPage(1);
      table.setPageSize(newSize);
    };
  
    if (loading) {
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
            Error loading data: {error}
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm h-[calc(95vh-120px)] flex flex-col">
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-blue-500/20">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="px-4 py-5 text-left text-sm font-medium text-blue-300"
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
              <Table>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => navigate(`/coin/${row.original.id}`)}
                      className="cursor-pointer transition-all duration-200 bg-blue-900/5 hover:bg-indigo-900 hover:transform"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-4 text-sm text-gray-200 first:rounded-l-lg last:rounded-r-lg"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>                                                                                
              </Table>
            </div>
          </div>
        </CardContent>
    
        <div className="p-2 border-t border-blue-500/20">
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
      </Card>
    );
  };

export default CoinTable;