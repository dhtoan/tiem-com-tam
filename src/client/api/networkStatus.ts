export function isOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

export function onNetworkStatusChange(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

export function createOfflineIndicator(): HTMLElement {
  const badge = document.createElement('div');
  badge.className = 'offline-badge';
  badge.setAttribute('data-testid', 'offline-badge');
  badge.textContent = 'Mất kết nối — Đang chơi offline';
  badge.style.display = isOnline() ? 'none' : 'block';

  onNetworkStatusChange((online) => {
    badge.style.display = online ? 'none' : 'block';
  });

  return badge;
}
