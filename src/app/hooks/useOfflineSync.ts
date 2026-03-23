import { useState, useEffect } from 'react';

interface QueuedOperation {
  id: string;
  type: 'performance' | 'player' | 'gameStats';
  action: 'add' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    // Load queue from localStorage
    const stored = localStorage.getItem('premier-select-sync-queue');
    if (stored) {
      setQueue(JSON.parse(stored));
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveQueue = (newQueue: QueuedOperation[]) => {
    setQueue(newQueue);
    localStorage.setItem('premier-select-sync-queue', JSON.stringify(newQueue));
  };

  const addToQueue = (operation: Omit<QueuedOperation, 'id' | 'timestamp'>) => {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: `queue-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    
    const newQueue = [...queue, queuedOp];
    saveQueue(newQueue);

    // If online, try to process immediately
    if (isOnline) {
      processQueue();
    }

    return queuedOp;
  };

  const processQueue = async () => {
    if (queue.length === 0) return;

    setSyncStatus('syncing');

    try {
      // In a real app, this would sync with a backend
      // For now, we'll just simulate a delay and clear the queue
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear queue after successful sync
      saveQueue([]);
      setSyncStatus('idle');
      
      console.log('✅ Offline queue synced successfully');
    } catch (error) {
      console.error('❌ Error syncing queue:', error);
      setSyncStatus('error');
    }
  };

  const clearQueue = () => {
    saveQueue([]);
  };

  return {
    isOnline,
    queue,
    syncStatus,
    addToQueue,
    processQueue,
    clearQueue,
    queueSize: queue.length,
  };
}
