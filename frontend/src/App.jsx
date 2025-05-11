import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import ColorManagement from './pages/ColorManagement';
import SizeManagement from './pages/SizeManagement';
import MaterialManagement from './pages/MaterialManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="colors" element={<ColorManagement />} />
          <Route path="sizes" element={<SizeManagement />} />
          <Route path="materials" element={<MaterialManagement />} />
          <Route path="*" element={<div className="text-center text-gray-800 dark:text-gray-200">404 - Page Not Found</div>} />
        </Route>
        <Route path="*" element={<div className="text-center text-gray-800 dark:text-gray-200">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;