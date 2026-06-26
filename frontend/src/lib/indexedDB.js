import { openDB } from 'idb';

const DB_NAME = 'HerbEncyclopediaDB';
const DB_VERSION = 1;

export async function initIndexedDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Herbs store
      if (!db.objectStoreNames.contains('herbs')) {
        const herbStore = db.createObjectStore('herbs', { keyPath: 'id' });
        herbStore.createIndex('name', 'name');
        herbStore.createIndex('updatedAt', 'updatedAt');
      }

      // Pending uploads store (for offline)
      if (!db.objectStoreNames.contains('pendingUploads')) {
        const uploadStore = db.createObjectStore('pendingUploads', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        uploadStore.createIndex('timestamp', 'timestamp');
      }

      // Cache store for general data
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    },
  });
  return db;
}

export async function cacheData(key, data) {
  const db = await initIndexedDB();
  await db.put('cache', { key, data, timestamp: Date.now() });
}

export async function getCachedData(key, maxAge = 7 * 24 * 60 * 60 * 1000) {
  const db = await initIndexedDB();
  const cached = await db.get('cache', key);
  
  if (!cached) return null;
  
  // Check if cache is still valid
  if (Date.now() - cached.timestamp > maxAge) {
    await db.delete('cache', key);
    return null;
  }
  
  return cached.data;
}

export async function saveHerbOffline(herb) {
  const db = await initIndexedDB();
  await db.put('herbs', herb);
}

export async function getHerbFromOffline(id) {
  const db = await initIndexedDB();
  return db.get('herbs', id);
}

export async function getAllHerbsFromOffline() {
  const db = await initIndexedDB();
  return db.getAll('herbs');
}

export async function addToPendingUpload(uploadData) {
  const db = await initIndexedDB();
  await db.add('pendingUploads', {
    ...uploadData,
    timestamp: Date.now(),
  });
}

export async function getPendingUploads() {
  const db = await initIndexedDB();
  return db.getAll('pendingUploads');
}

export async function clearPendingUpload(id) {
  const db = await initIndexedDB();
  await db.delete('pendingUploads', id);
}