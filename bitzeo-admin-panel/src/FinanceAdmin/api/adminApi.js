import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/admin", // change to your backend URL
  withCredentials: true, // important for cookies
});

// Register Employee / Admin
export const registerEmployee = (data) => API.post("/employee/register", data);

// Login
export const loginEmployee = (data) => API.post("/employee/login", data);

// Optional: logout
export const logoutEmployee = () => API.post("/employee/logout");