
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationSidebar from '../components/NotificationSidebar';

function MaterialManagement() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/materials`);
      setMaterials(res.data || []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
      setFetchError('Failed to load materials. Please check if the backend server is running.');
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
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/materials/${editId}`, form);
        setNotification({ message: 'Material updated successfully!', type: 'success' });
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/materials`, form);
        setNotification({ message: 'Material added successfully!', type: 'success' });
      }
      setForm({ name: '' });
      setEditId(null);
      setErrors({});
      fetchMaterials();
    } catch (err) {
      console.error('Failed to save material:', err);
      setNotification({
        message: err.response?.data?.error || 'Failed to save material. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setForm({ name: material.name });
    setEditId(material.id);
  };

  const handleDelete = (id) => {
    setShowConfirm(id);
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    setShowConfirm(null);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/materials/${id}`);
      setNotification({ message: 'Material deleted successfully!', type: 'success' });
      fetchMaterials();
    } catch (err) {
      console.error('Failed to delete material:', err);
      setNotification({ message: 'Failed to delete material. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Materials</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {editId ? 'Edit Material' : 'Add Material'}
        </h2>
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Material Name
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
          aria-label={editId ? 'Update material' : 'Add material'}
        >
          {loading ? 'Saving...' : editId ? 'Update Material' : 'Add Material'}
        </button>
      </form>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Material List</h2>
        {fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : materials.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No materials found.</p>
        ) : (
          <ul className="space-y-2">
            {materials.map((material) => (
              <li
                key={material.id}
                className="flex justify-between items-center p-2 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
              >
                <span className="text-gray-800 dark:text-gray-200">{material.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(material)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors shadow-sm"
                    aria-label={`Edit ${material.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors shadow-sm"
                    aria-label={`Delete ${material.name}`}
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
            <p>Are you sure you want to delete this material?</p>
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

export default MaterialManagement;
