import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';

export default function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">No images available</div>;
  }

  const currentImage = images[currentIndex];
  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <Image src={currentImage.url} alt={currentImage.caption || `Image ${currentIndex + 1}`} fill className="object-contain" />
        
        {images.length > 1 && (
          <>
            <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FaChevronLeft /></button>
            <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FaChevronRight /></button>
          </>
        )}

        <button onClick={() => setIsLightboxOpen(true)} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FaExpand /></button>
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{currentIndex + 1} / {images.length}</div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button key={image.id || index} onClick={() => setCurrentIndex(index)} className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${index === currentIndex ? 'border-primary-500 ring-2 ring-primary-300' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 text-white text-2xl bg-white/20 p-2 rounded-full hover:bg-white/40"><FaTimes /></button>
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <Image src={currentImage.url} alt={currentImage.caption} width={1200} height={800} className="max-h-full max-w-full object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40"><FaChevronLeft size={24} /></button>
                <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40"><FaChevronRight size={24} /></button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}