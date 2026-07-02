import Link from 'next/link';
import Image from 'next/image';

export default function HerbCard({ herb }) {
  const mainImage = herb.images?.[0]?.url || '/images/default-herb.svg';

  return (
    <Link href={`/herbs/${herb.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={herb.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-primary-700">
            {herb.family || 'Herb'}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {herb.name}
          </h3>
          <p className="text-sm text-gray-500 italic mb-2">
            {herb.scientificName}
          </p>
          <p className="text-gray-600 text-sm line-clamp-2">
            {herb.description}
          </p>
          
          {herb.tags && herb.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {herb.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {herb.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{herb.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}