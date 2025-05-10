const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Material = require('../models/Material');
const Color = require('../models/Color');
const Size = require('../models/Size');

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      order = 'ASC',
      categoryId,
      materialId,
      colorId,
      sizeId,
      minPrice = 0,
      maxPrice = Infinity,
      minQuantity = 0,
      maxQuantity = Infinity,
    } = req.query;

    const where = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (materialId) where.materialId = parseInt(materialId);
    if (colorId) where.colorId = parseInt(colorId);
    if (sizeId) where.sizeId = parseInt(sizeId);
    if (minPrice || maxPrice !== Infinity) where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    if (minQuantity || maxQuantity !== Infinity) where.quantity = { [Op.between]: [parseInt(minQuantity), parseInt(maxQuantity)] };

    const products = await Product.findAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, order.toUpperCase()]],
      include: [
        { model: Category, as: 'Category' },
        { model: Material, as: 'Material' },
        { model: Color, as: 'Color' },
        { model: Size, as: 'Size' },
      ],
    });

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      quantity,
      description,
      specification,
      categoryId,
      materialId,
      colorId,
      sizeId,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !quantity) throw new Error('Name, price, and quantity are required');

    const product = await Product.create({
      name,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      quantity: parseInt(quantity),
      image,
      description,
      specification,
      categoryId: categoryId ? parseInt(categoryId) : null,
      materialId: materialId ? parseInt(materialId) : null,
      colorId: colorId ? parseInt(colorId) : null,
      sizeId: sizeId ? parseInt(sizeId) : null,
    });

    res.status(201).json({ id: product.id, message: 'Product added' });
  } catch (err) {
    console.error('Error creating product:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to add product', details: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      oldPrice,
      quantity,
      description,
      specification,
      categoryId,
      materialId,
      colorId,
      sizeId,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');

    await product.update({
      name,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      quantity: parseInt(quantity),
      image: image || product.image,
      description,
      specification,
      categoryId: categoryId ? parseInt(categoryId) : null,
      materialId: materialId ? parseInt(materialId) : null,
      colorId: colorId ? parseInt(colorId) : null,
      sizeId: sizeId ? parseInt(sizeId) : null,
    });

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Error updating product:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
};