export interface PwaOptions {
  onUpdateAvailable?: (applyUpdate: () => void) => void;
}

export function registerServiceWorker(options: PwaOptions = {}): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // If there's already an updated worker waiting
        if (registration.waiting) {
          notifyUpdate(registration.waiting, options);
          return;
        }

        // Listen for an update during current session
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUpdate(newWorker, options);
            }
          });
        });
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}

function notifyUpdate(worker: ServiceWorker, options: PwaOptions): void {
  const applyUpdate = () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  };

  if (options.onUpdateAvailable) {
    options.onUpdateAvailable(applyUpdate);
  }
}
