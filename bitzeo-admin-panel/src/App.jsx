// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/layout/Layout";
import AdminLogin from "./Admin/pages/AdminLogin";
import EmployeeLogin from "./Admin/pages/EmployeeLogin";
import Register from "./Admin/pages/Register";
import ForgotPassword from "./Admin/pages/ForgotPassword";
import Dashboard from "./Admin/pages/Dashboard";
import FinanceDashboard from "./FinanceAdmin/Pages/FinanceDashboard";
import SupportDashboard from "./Admin/pages/SupportDashboard";
import ReadOnlyDashboard from "./Admin/pages/ReadOnlyDashboard";
import Orders from "./Admin/pages/Orders";
import Products from "./Admin/pages/Products";
import NotFound from "./Admin/pages/NotFound";
import VideoUpload from "./Admin/pages/VideoUpload";
import Shorts from "./Admin/pages/Shorts";
import CategoryManagement from "./Admin/CategoryManagement/Category";
import AllUsers from "./Admin/Users/AllUser";
import EmployeeRegister from "./Admin/pages/EmployeeRegister";

// ====================== AUTH CHECK ======================
const isAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};

// ====================== PROTECTED ROUTE ======================
function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// ====================== PUBLIC ONLY ROUTE ======================
// (already logged in user ko login/register pe nahi jaane dena)
function PublicOnlyRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e1b4b",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/Employeelogin" element={<EmployeeLogin />} />
        
        </Route>

        {/* ================= PROTECTED ADMIN ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Default Admin Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />

            {/* Role-Based Dashboards */}
            <Route path="/finance-dashboard" element={<FinanceDashboard />} />
            <Route path="/support-dashboard" element={<SupportDashboard />} />
            <Route
              path="/read-only-dashboard"
              element={<ReadOnlyDashboard />}
            />

            {/* Other Routes */}
            <Route path="video" element={<VideoUpload />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="category" element={<CategoryManagement />} />
            <Route path="alluser" element={<AllUsers />} />
              <Route path="/create-employee" element={<EmployeeRegister />} />
          </Route>
        </Route>
        {/* ================= 404 NOT FOUND ================= */}
        <Route path="/404" element={<NotFound />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
