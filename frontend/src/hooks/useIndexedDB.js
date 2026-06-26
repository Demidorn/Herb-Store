import { useCallback } from 'react';
import { cacheData, getCachedData, saveHerbOffline, getHerbFromOffline } from '../lib/indexedDB';

export function useIndexedDB() {
  const cache = useCallback(async (key, data) => {
    await cacheData(key, data);
  }, []);

  const getCached = useCallback(async (key, maxAge) => {
    return await getCachedData(key, maxAge);
  }, []);

  const saveOffline = useCallback(async (herb) => {
    await saveHerbOffline(herb);
  }, []);

  const getOffline = useCallback(async (id) => {
    return await getHerbFromOffline(id);
  }, []);

  return {
    cacheData: cache,
    getCachedData: getCached,
    saveHerbOffline: saveOffline,
    getHerbFromOffline: getOffline,
  };
}