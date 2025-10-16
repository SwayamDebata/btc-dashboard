import { useState, useEffect, useCallback, useRef } from 'react';

export interface BybitTickerData {
  lastPrice: string;
  highPrice24h: string;
  lowPrice24h: string;
  turnover24h: string;
  price24hPcnt: string;
  volume24h: string;
  timestamp: number;
}

interface WebSocketMessage {
  topic: string;
  type: string;
  data: {
    symbol: string;
    lastPrice: string;
    highPrice24h: string;
    lowPrice24h: string;
    turnover24h: string;
    price24hPcnt: string;
    volume24h: string;
  };
  ts: number;
}

export const useBybitWebSocket = () => {
  const [tickerData, setTickerData] = useState<BybitTickerData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      console.log('Connecting to ByBit WebSocket...');
      const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Subscribe to BTC/USDT ticker
        const subscribeMsg = {
          op: 'subscribe',
          args: ['tickers.BTCUSDT']
        };
        ws.send(JSON.stringify(subscribeMsg));
        console.log('Subscribed to tickers.BTCUSDT');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.topic === 'tickers.BTCUSDT' && message.data) {
            const data = message.data;
            
            // Validate data before setting
            if (data.lastPrice && data.highPrice24h && data.lowPrice24h) {
              console.log('Received ticker data:', data);
              
              const newTickerData: BybitTickerData = {
                lastPrice: data.lastPrice || '0',
                highPrice24h: data.highPrice24h || '0',
                lowPrice24h: data.lowPrice24h || '0',
                turnover24h: data.turnover24h || '0',
                price24hPcnt: data.price24hPcnt || '0',
                volume24h: data.volume24h || '0',
                timestamp: message.ts
              };
              
              setTickerData(newTickerData);
              
              // Update price history for sparkline (keep last 60 data points)
              const priceValue = parseFloat(data.lastPrice);
              if (!isNaN(priceValue)) {
                setPriceHistory(prev => {
                  const newHistory = [...prev, priceValue];
                  return newHistory.slice(-60);
                });
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  return {
    tickerData,
    isConnected,
    priceHistory,
    reconnect
  };
};

