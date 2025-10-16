import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useBybitWebSocket } from '@/hooks/useBybitWebSocket';
import { PriceCard } from '@/components/PriceCard';
import { TradingViewChart } from '@/components/TradingViewChart';
import { WebSocketStatus } from '@/components/WebSocketStatus';
import { PriceSparkline } from '@/components/PriceSparkline';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';

const Index = () => {
  const { tickerData, isConnected, priceHistory, reconnect } = useBybitWebSocket();
  const [previousPrice, setPreviousPrice] = useState<string>('0');

  useEffect(() => {
    if (tickerData?.lastPrice) {
      setPreviousPrice(tickerData.lastPrice);
    }
  }, [tickerData?.lastPrice]);

  const priceChange = tickerData ? parseFloat(tickerData.price24hPcnt) : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">₿</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Bitcoin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">Real-time BTC/USDT</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <WebSocketStatus isConnected={isConnected} onReconnect={reconnect} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Main Price Display */}
        {tickerData && (
          <Card className="glass-card p-6 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">BTC/USDT</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {priceChange.toFixed(2)}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    ${parseFloat(tickerData.lastPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    24h Volume: {parseFloat(tickerData.volume24h).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} BTC
                  </p>
                </div>
              </div>

              {priceHistory.length > 1 && (
                <div className="h-32 sm:h-40">
                  <PriceSparkline data={priceHistory} isPositive={isPositive} />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        {tickerData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PriceCard
              label="24h High"
              value={tickerData.highPrice24h}
            />
            <PriceCard
              label="24h Low"
              value={tickerData.lowPrice24h}
            />
            <PriceCard
              label="24h Volume"
              value={tickerData.turnover24h}
            />
            <PriceCard
              label="24h Change"
              value={tickerData.price24hPcnt}
            />
          </div>
        )}

        {/* Loading State */}
        {!tickerData && isConnected && (
          <Card className="glass-card p-8 text-center">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Receiving market data...</p>
            </div>
          </Card>
        )}

        {/* Disconnected State */}
        {!tickerData && !isConnected && (
          <Card className="glass-card p-8 text-center">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto">
                <TrendingDown className="h-6 w-6 text-danger" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Connection Lost</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unable to receive market data. Please check your connection.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* TradingView Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Live Chart</h2>
            <span className="text-xs text-muted-foreground">Powered by TradingView</span>
          </div>
          <TradingViewChart />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            Real-time data from ByBit WebSocket API • Market data updates automatically
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
