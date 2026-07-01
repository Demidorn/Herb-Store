import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { debounce } from '../utils/helpers';
import { APP_CONFIG } from '../utils/constants';

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search herbs...' }) {
  const [term, setTerm] = useState(initialValue);
  const debouncedSearch = debounce((value) => onSearch(value), APP_CONFIG.DEBOUNCE_DELAY);

  useEffect(() => { debouncedSearch(term); }, [term]);

  return (
    <div className="relative w-full md:w-8/12 ">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400 hover:text-primary-500" />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className=" text-gray-700 w-full pl-3 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary-500"
      />
      {term && (
        <button onClick={() => { setTerm(''); onSearch(''); }} className="absolute inset-y-0 right-10 pr-3 flex items-center text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      )}
    </div>
  );
}