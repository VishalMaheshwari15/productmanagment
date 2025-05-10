// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import MaterialManagement from './pages/MaterialManagement';
import ColorManagement from './pages/ColorManagement';
import SizeManagement from './pages/SizeManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all admin routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/materials" element={<MaterialManagement />} />
          <Route path="/colors" element={<ColorManagement />} />
          <Route path="/sizes" element={<SizeManagement />} />
          {/* Fallback route for debugging */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;