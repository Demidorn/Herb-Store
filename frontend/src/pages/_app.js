import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { initIndexedDB } from '../lib/indexedDB';
import { registerSW } from 'next-pwa';

function MyApp({ Component, pageProps }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize IndexedDB
    initIndexedDB().then(() => {
      setIsReady(true);
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerSW({
        onNeedRefresh: () => {
          if (confirm('New content available. Reload?')) {
            window.location.reload();
          }
        },
        onOfflineReady: () => {
          console.log('App ready to work offline');
        },
      });
    }
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;