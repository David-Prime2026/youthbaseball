import { useOfflineSync } from '../hooks/useOfflineSync';
import { Wifi, WifiOff, Cloud, CloudOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export function OfflineSyncIndicator() {
  const { isOnline, queueSize, syncStatus, processQueue } = useOfflineSync();

  if (isOnline && queueSize === 0 && syncStatus === 'idle') {
    return null; // Don't show when everything is normal
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-[#10b981]" />
            ) : (
              <WifiOff className="h-4 w-4 text-[#ef4444]" />
            )}
            <span className="text-[11px] text-[#94a3b8]">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Queue Status */}
          {queueSize > 0 && (
            <>
              <div className="h-4 w-px bg-[#334155]" />
              <div className="flex items-center gap-2">
                <CloudOff className="h-4 w-4 text-[#f59e0b]" />
                <span className="text-[11px] text-[#94a3b8]">
                  {queueSize} pending
                </span>
              </div>
            </>
          )}

          {/* Sync Status */}
          {syncStatus !== 'idle' && (
            <>
              <div className="h-4 w-px bg-[#334155]" />
              <div className="flex items-center gap-2">
                {syncStatus === 'syncing' && (
                  <>
                    <Cloud className="h-4 w-4 text-[#38bdf8] animate-pulse" />
                    <span className="text-[11px] text-[#38bdf8]">Syncing...</span>
                  </>
                )}
                {syncStatus === 'error' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-[#ef4444]" />
                    <span className="text-[11px] text-[#ef4444]">Sync failed</span>
                  </>
                )}
              </div>
            </>
          )}

          {/* Retry Button */}
          {isOnline && queueSize > 0 && syncStatus !== 'syncing' && (
            <Button
              onClick={processQueue}
              size="sm"
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9] h-6 px-2 text-[10px]"
            >
              Sync Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
