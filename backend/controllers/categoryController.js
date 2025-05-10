const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('Category name is required');
    const category = await Category.create({ name });
    res.status(201).json({ id: category.id, message: 'Category added' });
  } catch (err) {
    console.error('Error creating category:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to add category', details: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) throw new Error('Category name is required');
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    await category.update({ name });
    res.json({ message: 'Category updated' });
  } catch (err) {
    console.error('Error updating category:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
};