import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { HERB_CATEGORIES } from '../utils/constants';

export default function FilterPanel({ filters = {}, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (!value) delete newFilters[key];
    else newFilters[key] = value;
    onChange(newFilters);
  };

  const clearAllFilters = () => onChange({});
  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary-600">
          Filters {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
            <FaTimes size={10} /> Clear all
          </button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water Needs</label>
            <select value={filters.waterNeeds || ''} onChange={(e) => handleFilterChange('waterNeeds', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All</option>
              {HERB_CATEGORIES.WATER_NEEDS.map((need) => <option key={need} value={need}>{need}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunlight</label>
            <select value={filters.sunlight || ''} onChange={(e) => handleFilterChange('sunlight', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All</option>
              {HERB_CATEGORIES.SUNLIGHT.map((sun) => <option key={sun} value={sun}>{sun}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={filters.tag || ''} onChange={(e) => handleFilterChange('tag', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All Categories</option>
              {HERB_CATEGORIES.USES.map((use) => <option key={use} value={use.toLowerCase()}>{use}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}