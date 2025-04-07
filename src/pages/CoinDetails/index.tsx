import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCoinDetails } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoinDetails = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => fetchCoinDetails(coinId!),
    enabled: !!coinId,
  });

  useEffect(() => {
    if (error) {
      navigate('/', { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );                                                    
  }

  if (error) {
    return (
      <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="text-red-500 text-center p-4">
          Error loading coin details
        </CardContent>
      </Card>
    );
  }

  if (!coin) return null;

  return (
    <Card className="bg-black/20 border-blue-500/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          <img src={typeof coin.image === 'string' ? coin.image : (coin.image as { large: string }).large} alt={coin.name} className="w-16 h-16" />
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              {coin.name} ({coin.symbol.toUpperCase()})
            </CardTitle>
            <p className="text-blue-400">
              Rank #{coin.market_cap_rank}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-300">Price Statistics</h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-400">Current Price</span>
                <span className="text-white">${coin.market_data.current_price.usd.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white">${coin.market_data.market_cap.usd.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">24h Trading Volume</span>
                <span className="text-white">${coin.market_data.total_volume.usd.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-300">Price Change</h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">7d Change</span>
                <span className={coin.market_data.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">30d Change</span>
                <span className={coin.market_data.price_change_percentage_30d >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-300">Description</h3>
          <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: coin.description.en }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinDetails;