import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HerbCard from '../../components/HerbCard';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import { fetchHerbs } from '../../lib/api';
import { APP_CONFIG } from '../../utils/constants';
import { FaPlus } from 'react-icons/fa';

export default function BrowseHerbs() {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    loadHerbs();
  }, [searchTerm, filters, pagination.page]);

  const loadHerbs = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        page: pagination.page,
        limit: APP_CONFIG.ITEMS_PER_PAGE,
        ...filters,
      };
      const data = await fetchHerbs(params);
      setHerbs(data.herbs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading herbs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 })); 
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <Head>
        <title>Browse Herbs - Herb Encyclopedia</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Browse Herbs</h1>
            <p className="text-gray-600">Explore our comprehensive database</p>
          </div>
          <Link 
            href="/herbs/create"
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaPlus /> Add New Herb
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
          <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse h-80"></div>
            ))}
          </div>
        ) : herbs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No herbs found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {herbs.map((herb) => <HerbCard key={herb.id} herb={herb} />)}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border rounded-lg flex items-center">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}