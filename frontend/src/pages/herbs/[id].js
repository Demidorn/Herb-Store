import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import HerbDetail from '../../components/HerbDetail';
import { fetchHerbById } from '../../lib/api';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HerbDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [herb, setHerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getCachedData, cacheData } = useIndexedDB();

  useEffect(() => {
    if (id) {
      loadHerb();
    }
  }, [id]);

  const loadHerb = async () => {
    setLoading(true);
    try {
      const data = await fetchHerbById(id);
      setHerb(data);
      
      // Cache for offline access
      await cacheData(`herb-${id}`, data);
    } catch (error) {
      console.error('Error loading herb:', error);
      // Try cache
      const cached = await getCachedData(`herb-${id}`);
      if (cached) setHerb(cached);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!herb) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Herb not found</h1>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{herb.name} - Herb Encyclopedia</title>
        <meta name="description" content={herb.description} />
      </Head>
      <HerbDetail herb={herb} onUpdate={loadHerb} />
    </>
  );
}