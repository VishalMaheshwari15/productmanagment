// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import Filters from '../components/Filters';
import ProductList from '../components/ProductList';

function ProductManagement() {
  const [filters, setFilters] = useState({
    categoryId: '',
    materialId: '',
    colorId: '',
    sizeId: '',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    maxQuantity: '',
    sortBy: 'name',
    order: 'ASC',
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
      <ProductForm />
      <Filters filters={filters} setFilters={setFilters} />
      <ProductList filters={filters} />
    </div>
  );
}

export default ProductManagement;