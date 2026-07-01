import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import HerbCard from '../components/HerbCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { fetchHerbs } from '../lib/api';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const { getCachedData } = useIndexedDB();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    loadHerbs();
  }, [searchTerm, filters]);

  const loadHerbs = async () => {
    setLoading(true);
    try {
      const data = await fetchHerbs({ 
        search: searchTerm,
        ...filters 
      });
      setHerbs(data.herbs);
      
      // Cache for offline
      if ('caches' in window) {
        await getCachedData('herbs', data.herbs);
      }
    } catch (error) {
      console.error('Error loading herbs:', error);
      // Try to load from cache
      const cached = await getCachedData('herbs');
      if (cached) setHerbs(cached);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Herb Encyclopedia - Discover & Learn</title>
        <meta name="description" content="Explore our comprehensive herb encyclopedia" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">
            🌿 Herb Encyclopedia
          </h1>
          <p className="text-gray-600">
            Discover, learn, and grow your knowledge of herbs
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <SearchBar 
            initialValue={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search herbs..."
          />
          
          <Link 
            href="/herbs/create"
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors md:-mt-4"
          >
            <FaPlus />
            <span>Add Herb</span>
          </Link>
        </div>

        <FilterPanel filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse h-64"></div>
            ))}
          </div>
        ) : herbs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No herbs found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {herbs.map((herb) => (
              <HerbCard key={herb.id} herb={herb} />
            ))}
          </div>
        )}

        {!isOnline && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow">
            📴 You're offline - showing cached data
          </div>
        )}
      </div>
    </>
  );
}