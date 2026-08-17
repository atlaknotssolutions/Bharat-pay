import axios from "axios";
import { setupAdminAxiosAuth } from "./utils/session";

// Base URL from env (VITE_API_BASE_URL), localhost fallback for dev.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach admin JWT to every request from this admin panel and send cookies
// (admin refresh cookie). Registered on the shared default axios instance so
// raw axios calls (e.g. AllUser.jsx) are also covered.
const attachToken = (config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  return config;
};

axios.interceptors.request.use(attachToken);
API.interceptors.request.use(attachToken);

// Single-flight refresh + auto-retry on 401 for both instances.
setupAdminAxiosAuth(axios);
setupAdminAxiosAuth(API);

export default API;

// Admin Dashboard
export const getAdminDashboard = () => API.get("/admin/dashboard");

// Products
export const addProduct = (productData) => API.post("/product", productData);
export const fetchProducts = () => API.get("/product");
export const updateProduct = (id, productData) =>
  API.put(`/product/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/product/${id}`);


export const Registration = () => API.post("/register");
export const fetchRegistration = () => API.get("/display");

// Category
export const fetchcategory = () => API.get("/category");
export const addCategory = (name) => API.post("/category", { name });
export const updateCategory = (id, name) =>
  API.put(`/category/${id}`, { name });
export const deleteCategory = (id) => API.delete(`/category/${id}`);

