export const API_ENDPOINTS = {
  HERBS: '/api/herbs',
  HERB_BY_ID: (id) => `/api/herbs/${id}`,
  HERB_IMAGES: (id) => `/api/herbs/${id}/images`,
};

export const APP_CONFIG = {
  NAME: 'Herb Encyclopedia',
  VERSION: '1.0.0',
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES_PER_HERB: 10,
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300, // ms
};

export const HERB_CATEGORIES = {
  USES: ['Medicinal', 'Culinary', 'Ornamental', 'Aromatic'],
  WATER_NEEDS: ['Low', 'Moderate', 'High'],
  SUNLIGHT: ['Full Sun', 'Partial Shade', 'Full Shade'],
  IMAGE_TYPES: ['Plant', 'Flower', 'Leaf', 'Dried', 'Seeds'],
};

export const DEFAULT_IMAGE = '/images/default-herb.jpg';