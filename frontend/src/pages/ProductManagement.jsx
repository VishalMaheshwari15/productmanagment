
import React, { useState } from 'react';
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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleAddProduct = () => {
    setIsProductModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Products</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700 shadow-sm"
          aria-label="Add new product"
        >
          Add Product
        </button>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
          aria-label="Open filters"
        >
          Filter Products
        </button>
      </div>
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Add New Product</h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <ProductForm onAddProduct={handleAddProduct} />
          </div>
        </div>
      )}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Filter Products</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <Filters filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}
      <ProductList filters={filters} />
    </div>
  );
}

export default ProductManagement;