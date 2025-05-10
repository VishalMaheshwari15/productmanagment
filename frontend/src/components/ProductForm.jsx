// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    quantity: '',
    description: '',
    specification: '',
    categoryId: '',
    materialId: '',
    colorId: '',
    sizeId: '',
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
    if (!form.quantity || form.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    if (!form.categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (image) formData.append('image', image);

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Product added successfully!');
      setForm({
        name: '',
        price: '',
        oldPrice: '',
        quantity: '',
        description: '',
        specification: '',
        categoryId: '',
        materialId: '',
        colorId: '',
        sizeId: '',
      });
      setImage(null);
      setErrors({});
    } catch (err) {
      console.error('Failed to add product:', err);
      setErrors({ submit: 'Failed to add product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
      {success && <p className="text-green-600">{success}</p>}
      {errors.submit && <p className="text-red-600">{errors.submit}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
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
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
          aria-invalid={errors.price ? 'true' : 'false'}
          aria-describedby={errors.price ? 'price-error' : undefined}
        />
        {errors.price && (
          <p id="price-error" className="text-red-600 text-sm">{errors.price}</p>
        )}
      </div>
      <div>
        <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
          Old Price (Optional)
        </label>
        <input
          id="oldPrice"
          type="number"
          step="0.01"
          value={form.oldPrice}
          onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className={`w-full p-2 border rounded ${errors.quantity ? 'border-red-500' : ''}`}
          aria-invalid={errors.quantity ? 'true' : 'false'}
          aria-describedby={errors.quantity ? 'quantity-error' : undefined}
        />
        {errors.quantity && (
          <p id="quantity-error" className="text-red-600 text-sm">{errors.quantity}</p>
        )}
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image (JPEG/PNG)
        </label>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="specification" className="block text-sm font-medium text-gray-700">
          Specification
        </label>
        <textarea
          id="specification"
          value={form.specification}
          onChange={(e) => setForm({ ...form, specification: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className={`w-full p-2 border rounded ${errors.categoryId ? 'border-red-500' : ''}`}
          aria-invalid={errors.categoryId ? 'true' : 'false'}
          aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p id="categoryId-error" className="text-red-600 text-sm">{errors.categoryId}</p>
        )}
      </div>
      <div>
        <label htmlFor="materialId" className="block text-sm font-medium text-gray-700">
          Material
        </label>
        <select
          id="materialId"
          value={form.materialId}
          onChange={(e) => setForm({ ...form, materialId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Material</option>
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
          value={form.colorId}
          onChange={(e) => setForm({ ...form, colorId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Color</option>
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
          value={form.sizeId}
          onChange={(e) => setForm({ ...form, sizeId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Size</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
        aria-label="Add product"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}

export default ProductForm;