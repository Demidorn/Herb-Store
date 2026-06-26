import Link from 'next/link';
import ImageGallery from './ImageGallery';
import { formatDate } from '../utils/helpers';
import { deleteHerb } from '../lib/api';
import { useRouter } from 'next/router';
import { FaEdit, FaTrash, FaArrowLeft, FaLeaf, FaTint, FaSun, FaSeedling } from 'react-icons/fa';

export default function HerbDetail({ herb }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this herb?')) return;
    try {
      await deleteHerb(herb.id);
      router.push('/herbs');
    } catch (error) {
      alert('Failed to delete herb.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/herbs" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"><FaArrowLeft /> Back</Link>
        <div className="flex gap-2">
          <Link href={`/herbs/edit/${herb.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaEdit /> Edit</Link>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><FaTrash /> Delete</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50"><ImageGallery images={herb.images} /></div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{herb.name}</h1>
          <p className="text-xl text-gray-500 italic mb-4">{herb.scientificName}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {herb.family && <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">Family: {herb.family}</span>}
            {herb.tags?.map((tag, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}</span>)}
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{herb.description}</p>
          </section>

          {herb.growing && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Growing Conditions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {herb.growing.sunlight && <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"><FaSun className="text-yellow-500 text-xl" /><div><p className="text-xs text-gray-500">Sunlight</p><p className="font-medium">{herb.growing.sunlight}</p></div></div>}
                {herb.growing.waterNeeds && <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"><FaTint className="text-blue-500 text-xl" /><div><p className="text-xs text-gray-500">Water</p><p className="font-medium">{herb.growing.waterNeeds}</p></div></div>}
                {herb.growing.soilType && <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg"><FaSeedling className="text-amber-600 text-xl" /><div><p className="text-xs text-gray-500">Soil</p><p className="font-medium">{herb.growing.soilType}</p></div></div>}
                {herb.growing.climate && <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"><FaLeaf className="text-green-500 text-xl" /><div><p className="text-xs text-gray-500">Climate</p><p className="font-medium">{herb.growing.climate}</p></div></div>}
              </div>
            </section>
          )}

          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
            <span>Added: {formatDate(herb.createdAt)}</span>
            <span>Updated: {formatDate(herb.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}