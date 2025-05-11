// frontend/src/pages/ColorManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NotificationSidebar from '../components/NotificationSidebar';

function ColorManagement() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [selectedColor, setSelectedColor] = useState('#000000'); // Local state for canvas-selected color
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [showConfirm, setShowConfirm] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const canvasRef = useRef(null);

  // Local storage for color display (since backend doesn't store color data)
  const [colorDisplayMap, setColorDisplayMap] = useState({}); // { colorId: hexCode }

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    if (showPicker) {
      drawColorPicker();
    }
  }, [showPicker]);

  const fetchColors = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/colors`);
      setColors(res.data || []);
      // Initialize color display map with random colors if not set
      const newColorMap = { ...colorDisplayMap };
      res.data.forEach((color) => {
        if (!newColorMap[color.id]) {
          newColorMap[color.id] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        }
      });
      setColorDisplayMap(newColorMap);
    } catch (err) {
      console.error('Failed to fetch colors:', err);
      setFetchError('Failed to load colors. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const drawColorPicker = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Create a hue gradient (red to violet)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.17, 'yellow');
    gradient.addColorStop(0.33, 'lime');
    gradient.addColorStop(0.5, 'cyan');
    gradient.addColorStop(0.67, 'blue');
    gradient.addColorStop(0.83, 'magenta');
    gradient.addColorStop(1, 'red');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add a saturation and lightness overlay
    const gradientWhite = ctx.createLinearGradient(0, 0, 0, height);
    gradientWhite.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradientWhite;
    ctx.fillRect(0, 0, width, height);

    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);
    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradientBlack.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradientBlack;
    ctx.fillRect(0, 0, width, height);
  };

  const pickColor = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];
    const hex = rgbToHex(r, g, b);

    setSelectedColor(hex);
    setShowPicker(false);
  };

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
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
        setNotification({ message: 'Color updated successfully!', type: 'success' });
        setColorDisplayMap((prev) => ({
          ...prev,
          [editId]: selectedColor,
        }));
      } else {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/colors`, form);
        setNotification({ message: 'Color added successfully!', type: 'success' });
        setColorDisplayMap((prev) => ({
          ...prev,
          [res.data.id]: selectedColor,
        }));
      }
      setForm({ name: '' });
      setSelectedColor('#000000');
      setEditId(null);
      setErrors({});
      fetchColors();
    } catch (err) {
      console.error('Failed to save color:', err);
      setNotification({
        message: err.response?.data?.error || 'Failed to save color. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (color) => {
    setForm({ name: color.name });
    setSelectedColor(colorDisplayMap[color.id] || '#000000');
    setEditId(color.id);
  };

  const handleDelete = (id) => {
    setShowConfirm(id);
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    setShowConfirm(null);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/colors/${id}`);
      setNotification({ message: 'Color deleted successfully!', type: 'success' });
      setColorDisplayMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
      fetchColors();
    } catch (err) {
      console.error('Failed to delete color:', err);
      setNotification({ message: 'Failed to delete color. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Colors</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {editId ? 'Edit Color' : 'Add Color'}
        </h2>
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color Name
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Color
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              {showPicker ? 'Hide Color Picker' : 'Show Color Picker'}
            </button>
            <div
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          {showPicker && (
            <div className="mt-2">
              <canvas
                ref={canvasRef}
                width="300"
                height="150"
                className="border border-gray-300 dark:border-gray-600 cursor-pointer rounded-lg shadow-sm"
                onClick={pickColor}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm`}
          aria-label={editId ? 'Update color' : 'Add color'}
        >
          {loading ? 'Saving...' : editId ? 'Update Color' : 'Add Color'}
        </button>
      </form>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Color List</h2>
        {fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : colors.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No colors found.</p>
        ) : (
          <ul className="space-y-2">
            {colors.map((color) => (
              <li
                key={color.id}
                className="flex justify-between items-center p-2 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: colorDisplayMap[color.id] || '#000000' }}
                  />
                  <span className="text-gray-800 dark:text-gray-200">{color.name}</span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(color)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors shadow-sm"
                    aria-label={`Edit ${color.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors shadow-sm"
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

      {/* Notification Sidebar */}
      <NotificationSidebar
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />

      {/* Delete Confirmation Sidebar */}
      {showConfirm && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg bg-yellow-500 text-white">
          <div className="flex flex-col space-y-2">
            <p>Are you sure you want to delete this color?</p>
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

export default ColorManagement;