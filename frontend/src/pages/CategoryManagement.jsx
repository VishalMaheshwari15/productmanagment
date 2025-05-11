
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationSidebar from '../components/NotificationSidebar';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setFetchError('Failed to load categories. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/categories/${editId}`, form);
        setNotification({ message: 'Category updated successfully!', type: 'success' });
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/categories`, form);
        setNotification({ message: 'Category added successfully!', type: 'success' });
      }
      setForm({ name: '' });
      setEditId(null);
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      setNotification({
        message: err.response?.data?.error || 'Failed to save category. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditId(category.id);
  };

  const handleDelete = (id) => {
    setShowConfirm(id);
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    setShowConfirm(null);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/categories/${id}`);
      setNotification({ message: 'Category deleted successfully!', type: 'success' });
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setNotification({ message: 'Failed to delete category. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {editId ? 'Edit Category' : 'Add Category'}
        </h2>
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-600 text-sm">{errors.name}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm`}
          aria-label={editId ? 'Update category' : 'Add category'}
        >
          {loading ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Category List</h2>
        {fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex justify-between items-center p-2 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
              >
                <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors shadow-sm"
                    aria-label={`Edit ${category.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors shadow-sm"
                    aria-label={`Delete ${category.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <NotificationSidebar
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
      {showConfirm && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg bg-yellow-500 text-white">
          <div className="flex flex-col space-y-2">
            <p>Are you sure you want to delete this category?</p>
            <div className="flex space-x-2">
              <button
                onClick={() => confirmDelete(showConfirm)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors shadow-sm"
                aria-label="Confirm delete"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;
