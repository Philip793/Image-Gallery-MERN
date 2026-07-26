const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal: options.signal
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const errorBody = await response.json();

      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // The response was not JSON, so use the default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export function getLandingImages(signal) {
  return request("/galleries/landing", { signal });
}

export function getGallery(slug, signal) {
  return request(`/galleries/${encodeURIComponent(slug)}`, {
    signal
  });
}
