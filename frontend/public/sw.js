// Custom service worker enhancements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle background sync for offline image uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-herb-images') {
    event.waitUntil(syncHerbImages());
  }
});

async function syncHerbImages() {
  // Implementation for syncing offline uploads
  const db = await openDB();
  const pendingUploads = await db.getAll('pendingUploads');
  
  for (const upload of pendingUploads) {
    try {
      await fetch('/api/herbs/' + upload.herbId + '/images', {
        method: 'POST',
        body: upload.formData,
      });
      await db.delete('pendingUploads', upload.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HerbApp', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Herb Encyclopedia', {
      body: data.body || 'New update available',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
    })
  );
});