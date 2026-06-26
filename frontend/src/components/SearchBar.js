import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { debounce } from '../utils/helpers';
import { APP_CONFIG } from '../utils/constants';

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search herbs...' }) {
  const [term, setTerm] = useState(initialValue);
  const debouncedSearch = debounce((value) => onSearch(value), APP_CONFIG.DEBOUNCE_DELAY);

  useEffect(() => { debouncedSearch(term); }, [term]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      {term && (
        <button onClick={() => { setTerm(''); onSearch(''); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      )}
    </div>
  );
}