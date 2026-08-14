const API_ORIGIN = String(
  import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000`
).replace(/\/+$/, "");

const API_BASE = `${API_ORIGIN}/api`;
const API_USERVIDEO = `${API_ORIGIN}/api/uservideo`;

export { API_ORIGIN, API_BASE, API_USERVIDEO };
