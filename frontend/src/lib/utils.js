/**
 * Utility to conditionally join classNames together (similar to clsx/classnames)
 * Useful for Tailwind CSS conditional styling
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Builds a URL query string from an object, ignoring null/undefined/empty values
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

/**
 * Safe wrapper for localStorage to prevent SSR (Server-Side Rendering) errors in Next.js
 */
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },
  
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

/**
 * Parses error responses from the backend API
 */
export async function parseAPIError(response) {
  try {
    const errorData = await response.json();
    return (
      errorData.error?.message || 
      errorData.message || 
      'An unknown error occurred'
    );
  } catch (e) {
    return `HTTP Error: ${response.status} ${response.statusText}`;
  }
}

/**
 * Generates a random ID (useful for temporary keys in React lists before DB save)
 */
export function generateTempId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
