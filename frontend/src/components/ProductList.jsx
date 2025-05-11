import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationSidebar from './NotificationSidebar';

function ProductList({ filters }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const limit = 5;

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // Prepare query parameters, ensuring filters are applied only if they exist
      const queryParams = {
        page,
        limit,
        ...filters,
      };

      // Remove empty filter values to ensure the API fetches all products by default
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key] || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const query = new URLSearchParams(queryParams).toString();
      console.log('Fetching products with query:', query); // Debug log

      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products?${query}`);
      console.log('API Response:', res.data); // Debug log

      const fetchedProducts = res.data.products || [];
      setProducts(fetchedProducts);
      setTotal(res.data.total || 0);

      if (fetchedProducts.length === 0) {
        console.warn('No products returned from API. Check API response or filters.');
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setFetchError('Failed to load products. Using mock data.');
      setProducts([
        { id: 1, name: 'Product 1', price: 100, quantity: 10, Category: { name: 'Electronics' } },
        { id: 2, name: 'Product 2', price: 200, quantity: 20, Category: { name: 'Clothing' }, Material: { name: 'Cotton' }, Color: { name: 'Blue' }, Size: { name: 'Medium' } },
      ]);
      setTotal(2);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`);
      setNotification({ message: 'Product deleted successfully!', type: 'success' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setNotification({ message: 'Failed to delete product. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">All Products</h2>
      {fetchError && <p className="text-red-600 dark:text-red-400 mb-4">{fetchError}</p>}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col"
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {product.image ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image: ${product.image}`);
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="mt-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">₹{product.price}</p>
                  {product.oldPrice && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{product.oldPrice}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quantity: {product.quantity}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {product.Category?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Material: {product.Material?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Color: {product.Color?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Size: {product.Size?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  Description: {product.description || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  Specification: {product.specification || 'N/A'}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(product.id)}
                className="mt-4 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                aria-label={`Delete ${product.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
          className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>
        <button
          disabled={page * limit >= total || loading}
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      <NotificationSidebar
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default ProductList;