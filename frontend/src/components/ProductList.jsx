// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList({ filters }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products?${query}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row gap-4"
            >
              <div className="flex-shrink-0">
                {product.image ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p>
                  Price: ${product.price}{' '}
                  {product.oldPrice && (
                    <span className="line-through text-gray-500">${product.oldPrice}</span>
                  )}
                </p>
                <p>Quantity: {product.quantity}</p>
                <p>Category: {product.Category?.name || 'N/A'}</p>
                <p>Material: {product.Material?.name || 'N/A'}</p>
                <p>Color: {product.Color?.name || 'N/A'}</p>
                <p>Size: {product.Size?.name || 'N/A'}</p>
                <p>Description: {product.description || 'N/A'}</p>
                <p>Specification: {product.specification || 'N/A'}</p>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                aria-label={`Delete ${product.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex justify-between">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          disabled={page * limit >= total || loading}
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;