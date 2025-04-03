import { useState, useEffect, useRef } from 'react';
import { Rocket, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchCoinsQuery } from '../api/api';
import { SearchResult } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/useDebounce';

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchCoinsQuery(query);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-sm border-b border-purple-500/20 py-5">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              2TheMoon
            </span>
          </div>
          
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search coins..."
              className="w-64 px-4 py-2 rounded-full bg-purple-900/30 border border-blue-500/30 focus:outline-none focus:border-blue-400 text-white placeholder-blue-300"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-400" />
            
            {showResults && (query || isLoading) && (
              <div className="absolute mt-2 w-full bg-black/95 rounded-lg border border-blue-500/30 shadow-lg backdrop-blur-sm overflow-hidden z-[60]">
                {isLoading ? (
                  <div className="p-4 text-center text-blue-300">Loading...</div>
                ) : data?.coins.length ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    {data.coins.slice(0, 5).map((coin) => (
                      <div
                        key={coin.id}
                        onClick={() => {
                          navigate(`/coin/${coin.id}`);
                          setShowResults(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-blue-900/30 cursor-pointer transition-colors"
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-white">{coin.name}</span>
                          <span className="text-sm text-blue-300">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-blue-300">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;