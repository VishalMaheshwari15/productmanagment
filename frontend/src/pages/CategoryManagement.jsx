// src/pages/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
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
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/categories`, form);
      }
      setForm({ name: '' });
      setEditId(null);
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      setErrors({ submit: 'Failed to save category. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editId ? 'Edit Category' : 'Add Category'}
        </h2>
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
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
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
          aria-label={editId ? 'Update category' : 'Add category'}
        >
          {loading ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Category List</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{category.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    aria-label={`Edit ${category.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
    </div>
  );
}

export default CategoryManagement;