const Color = require('../models/Color');

exports.getColors = async (req, res) => {
  try {
    const colors = await Color.findAll();
    res.json(colors);
  } catch (err) {
    console.error('Error fetching colors:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch colors', details: err.message });
  }
};

exports.createColor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('Color name is required');
    const color = await Color.create({ name });
    res.status(201).json({ id: color.id, message: 'Color added' });
  } catch (err) {
    console.error('Error creating color:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to add color', details: err.message });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) throw new Error('Color name is required');
    const color = await Color.findByPk(id);
    if (!color) throw new Error('Color not found');
    await color.update({ name });
    res.json({ message: 'Color updated' });
  } catch (err) {
    console.error('Error updating color:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update color', details: err.message });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByPk(id);
    if (!color) throw new Error('Color not found');
    await color.destroy();
    res.json({ message: 'Color deleted' });
  } catch (err) {
    console.error('Error deleting color:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete color', details: err.message });
  }
};