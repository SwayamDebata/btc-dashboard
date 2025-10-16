import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Check if script already exists
    let script = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]') as HTMLScriptElement;
    
    const initWidget = () => {
      if (containerRef.current && window.TradingView) {
        // Clear container
        containerRef.current.innerHTML = '';

        // Create new widget
        try {
          widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: 'BYBIT:BTCUSDT',
            interval: '15',
            timezone: 'Etc/UTC',
            theme: theme === 'dark' ? 'dark' : 'light',
            style: '1',
            locale: 'en',
            toolbar_bg: theme === 'dark' ? 'rgba(14, 17, 26, 0.8)' : 'rgba(245, 245, 245, 0.8)',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview_chart',
            hide_side_toolbar: false,
            backgroundColor: theme === 'dark' ? 'rgba(14, 17, 26, 1)' : '#ffffff',
            gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
          });
          console.log('TradingView widget initialized');
        } catch (error) {
          console.error('Error initializing TradingView widget:', error);
        }
      }
    };

    if (!script) {
      // Create script if it doesn't exist
      script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else if (window.TradingView) {
      // Script already loaded, just init widget
      initWidget();
    } else {
      // Script exists but not loaded yet
      script.onload = initWidget;
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current = null;
      }
    };
  }, [theme]);

  return (
    <div className="w-full h-[500px] sm:h-[600px] rounded-xl overflow-hidden glass-card">
      <div 
        id="tradingview_chart" 
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
};
