// src/components/Filters.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

function Filters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, matRes, colRes, sizeRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/materials`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/colors`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/sizes`),
        ]);
        setCategories(catRes.data);
        setMaterials(matRes.data);
        setColors(colRes.data);
        setSizes(sizeRes.data);
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchData();
  }, []);

  const handleReset = () => {
    setFilters({
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
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter & Sort Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="materialId" className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <select
            id="materialId"
            value={filters.materialId}
            onChange={(e) => setFilters({ ...filters, materialId: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Filter by material"
          >
            <option value="">All Materials</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="colorId" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <select
            id="colorId"
            value={filters.colorId}
            onChange={(e) => setFilters({ ...filters, colorId: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Filter by color"
          >
            <option value="">All Colors</option>
            {colors.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sizeId" className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <select
            id="sizeId"
            value={filters.sizeId}
            onChange={(e) => setFilters({ ...filters, sizeId: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Filter by size"
          >
            <option value="">All Sizes</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Min Price
          </label>
          <input
            id="minPrice"
            type="number"
            step="0.01"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Minimum price filter"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Max Price
          </label>
          <input
            id="maxPrice"
            type="number"
            step="0.01"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Maximum price filter"
          />
        </div>
        <div>
          <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700">
            Min Quantity
          </label>
          <input
            id="minQuantity"
            type="number"
            placeholder="Min Quantity"
            value={filters.minQuantity}
            onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Minimum quantity filter"
          />
        </div>
        <div>
          <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700">
            Max Quantity
          </label>
          <input
            id="maxQuantity"
            type="number"
            placeholder="Max Quantity"
            value={filters.maxQuantity}
            onChange={(e) => setFilters({ ...filters, maxQuantity: e.target.value })}
            className="w-full p-2 border rounded"
            aria-label="Maximum quantity filter"
          />
        </div>
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <Listbox
            value={filters.sortBy}
            onChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <Listbox.Button
              id="sortBy"
              className="w-full p-2 border rounded flex justify-between items-center"
              aria-label="Sort by"
            >
              <span>
                {filters.sortBy === 'name'
                  ? 'Name'
                  : filters.sortBy === 'price'
                  ? 'Price'
                  : 'Quantity'}
              </span>
              <ChevronDown size={20} />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-48 bg-white border rounded shadow-lg">
              <Listbox.Option
                value="name"
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Name
              </Listbox.Option>
              <Listbox.Option
                value="price"
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Price
              </Listbox.Option>
              <Listbox.Option
                value="quantity"
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Quantity
              </Listbox.Option>
            </Listbox.Options>
          </Listbox>
        </div>
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <Listbox
            value={filters.order}
            onChange={(value) => setFilters({ ...filters, order: value })}
          >
            <Listbox.Button
              id="order"
              className="w-full p-2 border rounded flex justify-between items-center"
              aria-label="Sort order"
            >
              <span>{filters.order === 'ASC' ? 'Ascending' : 'Descending'}</span>
              <ChevronDown size={20} />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-48 bg-white border rounded shadow-lg">
              <Listbox.Option
                value="ASC"
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Ascending
              </Listbox.Option>
              <Listbox.Option
                value="DESC"
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Descending
              </Listbox.Option>
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilters({ ...filters })} // Trigger ProductList re-render
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          aria-label="Reset filters"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;