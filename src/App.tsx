
import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const refreshing = useRef(false);

  useEffect(() => {
    // Detect install events
    const beforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', beforeInstall);

    // Detect standalone
    const mq = window.matchMedia('(display-mode: standalone)');
    const onChange = () => setStandalone(mq.matches || (window.navigator as any).standalone === true);
    onChange();
    mq.addEventListener?.('change', onChange);

    // SW update flow
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    });

    // Listen for update ready message
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setUpdateAvailable(true);
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      mq.removeEventListener?.('change', onChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleRefresh = () => {
    navigator.serviceWorker?.getRegistration().then(reg => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div className="container">
      <header>
        <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
          <div className="row" style={{alignItems:'center'}}>
            <span className="chip"><span className="dot" /> Dark&nbsp;PWA</span>
          </div>
          <div className="row">
            {updateAvailable && (
              <button onClick={handleRefresh} className="primary">Update verfügbar – Neu laden</button>
            )}
            {!isStandalone && deferredPrompt && (
              <button onClick={handleInstall} className="primary">Installieren</button>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="card">
          <h1>Moderne PWA. Dunkles Design.</h1>
          <p>React + Vite + TypeScript. Installierbar, offline-fähig, schnell.</p>
          <div className="row">
            <a href="https://web.dev/learn/pwa" target="_blank" rel="noreferrer" className="chip">
              <span className="dot" /> PWA-Guide
            </a>
            <a href="https://vitejs.dev/guide/" target="_blank" rel="noreferrer" className="chip">
              <span className="dot" /> Vite Guide
            </a>
          </div>
        </div>
      </main>
      <footer>
        <small>&copy; {new Date().getFullYear()} Dark PWA Starter</small>
      </footer>
    </div>
  );
}
