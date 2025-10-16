import { Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WebSocketStatusProps {
  isConnected: boolean;
  onReconnect: () => void;
}

export const WebSocketStatus = ({ isConnected, onReconnect }: WebSocketStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        isConnected 
          ? "bg-success/10 text-success" 
          : "bg-danger/10 text-danger"
      )}>
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Disconnected</span>
          </>
        )}
      </div>
      
      {!isConnected && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReconnect}
          className="h-8"
        >
          Reconnect
        </Button>
      )}
    </div>
  );
};
