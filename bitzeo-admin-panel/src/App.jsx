// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Login from './Admin/pages/Login';           // ← add this
import Dashboard from './Admin/pages/Dashboard';
import Users from './Admin/pages/Users';
import Orders from './Admin/pages/Orders';
import Products from './Admin/pages/Products';
import NotFound from './Admin/pages/NotFound';
import VideoUpload from './Admin/pages/VideoUpload';
import Category from './Admin/CategoryManagement/Category';
// import SubCategoryManagement from './Admin/CategoryManagement/SubCategoryManagement';
import CategoryManagement from './Admin/CategoryManagement/Category';
import AllUsers from './Admin/Users/AllUser';

// Very simple auth check (later you can use context / zustand / redux)
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Protects all admin routes
function ProtectedAdmin() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* All admin pages are protected */}
        
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />  
            <Route path="video" element={<VideoUpload />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="category" element={<CategoryManagement/>} />
            {/* <Route path="subcategory" element={<SubCategoryManagement />} /> */}
            <Route path="alluser" element={<AllUsers/>} />
            <Route path="*" element={<NotFound />} />
          </Route>
   ``

        {/* If someone types random URL and is not logged in → go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;