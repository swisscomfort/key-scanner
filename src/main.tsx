
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
  const reg = await navigator.serviceWorker.register('sw.js');
      // Optional: check for updates and notify UI
      setInterval(async () => {
        await reg.update();
        const newWorker = reg.installing || reg.waiting;
        if (newWorker) {
          newWorker.postMessage({ type: 'UPDATE_AVAILABLE' });
        }
      }, 60_000);
    } catch (e) {
      console.warn('SW registration failed', e);
    }
  });
}
