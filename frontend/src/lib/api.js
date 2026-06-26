const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchHerbs(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/api/herbs${queryString ? `?${queryString}` : ''}`);
  return handleResponse(response);
}

export async function fetchHerbById(id) {
  const response = await fetch(`${API_URL}/api/herbs/${id}`);
  return handleResponse(response);
}

export async function createHerb(data) {
  const response = await fetch(`${API_URL}/api/herbs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateHerb(id, data) {
  const response = await fetch(`${API_URL}/api/herbs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteHerb(id) {
  const response = await fetch(`${API_URL}/api/herbs/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function uploadImages(herbId, images) {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await fetch(`${API_URL}/api/herbs/${herbId}/images`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

export async function deleteImage(herbId, imageId) {
  const response = await fetch(`${API_URL}/api/herbs/${herbId}/images/${imageId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}