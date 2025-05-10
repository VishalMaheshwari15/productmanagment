// src/pages/ColorManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ColorManagement() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Add state for fetch errors

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    setFetchError(null); // Reset fetch error
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/colors`);
      setColors(res.data || []); // Ensure colors is an array even if API returns null
    } catch (err) {
      console.error('Failed to fetch colors:', err);
      setFetchError('Failed to load colors. Please check if the backend server is running.');
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
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/colors/${editId}`, form);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/colors`, form);
      }
      setForm({ name: '' });
      setEditId(null);
      setErrors({});
      fetchColors();
    } catch (err) {
      console.error('Failed to save color:', err);
      setErrors({ submit: 'Failed to save color. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (color) => {
    setForm({ name: color.name });
    setEditId(color.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this color?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/colors/${id}`);
      fetchColors();
    } catch (err) {
      console.error('Failed to delete color:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Colors</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editId ? 'Edit Color' : 'Add Color'}
        </h2>
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Color Name
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
          aria-label={editId ? 'Update color' : 'Add color'}
        >
          {loading ? 'Saving...' : editId ? 'Update Color' : 'Add Color'}
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Color List</h2>
        {fetchError ? (
          <p className="text-red-600">{fetchError}</p> // Display fetch error
        ) : loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : colors.length === 0 ? (
          <p className="text-gray-600">No colors found.</p>
        ) : (
          <ul className="space-y-2">
            {colors.map((color) => (
              <li
                key={color.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{color.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(color)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    aria-label={`Edit ${color.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    aria-label={`Delete ${color.name}`}
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

export default ColorManagement;