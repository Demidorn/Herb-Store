import { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { FaDownload, FaTimes } from 'react-icons/fa';

export default function InstallPrompt() {
  const [show, setShow] = useState(true);
  const { isInstallable, isInstalled, install } = usePWA();

  if (!show || !isInstallable || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <FaDownload className="text-primary-600 text-xl" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">Install Herb Encyclopedia</h3>
          <p className="text-sm text-gray-600 mb-3">
            Add to your home screen for quick access and offline use
          </p>
          
          <button
            onClick={async () => {
              await install();
              setShow(false);
            }}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}