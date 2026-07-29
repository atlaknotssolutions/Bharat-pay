import axios from "axios";

const API = axios.create({
  baseURL: "https://bitzo-server-2.onrender.com/api",
});

// Products
export const addProduct = (productData) => API.post("/product", productData);
export const fetchProducts = () => API.get("/product");
export const updateProduct = (id, productData) =>
  API.put(`/product/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/product/${id}`);

// Barcode / Cart
export const getProductByBarcode = (barcode) =>
  API.post(`/cart/add/${barcode}`);
export const addProductToCart = (productId) =>
  API.post(`/cart/add/${productId}`);

// Auth / Registration
export const Registration = () => API.post("/register");
export const fetchRegistration = () => API.get("/display");

// Category
export const fetchcategory = () => API.get("/category");
export const addCategory = (name) => API.post("/category", { name });
export const updateCategory = (id, name) =>
  API.put(`/category/${id}`, { name });
export const deleteCategory = (id) => API.delete(`/category/${id}`);

// Subcategory
export const fetchSubcategory = (categoryId) =>
  categoryId
    ? API.get(`/subcategory?categoryId=${categoryId}`)
    : API.get("/subcategory");

export const addSubCategory = (data) => API.post("/subcategory", data);

export const updateSubCategory = (id, data) =>
  API.put(`/subcategory/${id}`, data);

export const deleteSubCategory = (id) => API.delete(`/subcategory/${id}`);

// Extra
export const getProductByBarcodes = (barcode) =>
  API.get(`/products/barcode/${barcode}`);

// ✅ FIXED (API_URL was undefined)
export const scanProduct = (barcodeData) =>
  API.put("/purchase/scan", barcodeData);
