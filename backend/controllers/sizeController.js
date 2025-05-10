  const Size = require('../models/Size');

  exports.getSizes = async (req, res) => {
    try {
      const sizes = await Size.findAll();
      res.json(sizes);
    } catch (err) {
      console.error('Error fetching sizes:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to fetch sizes', details: err.message });
    }
  };

  exports.createSize = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) throw new Error('Size name is required');
      const size = await Size.create({ name });
      res.status(201).json({ id: size.id, message: 'Size added' });
    } catch (err) {
      console.error('Error creating size:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to add size', details: err.message });
    }
  };

  exports.updateSize = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) throw new Error('Size name is required');
      const size = await Size.findByPk(id);
      if (!size) throw new Error('Size not found');
      await size.update({ name });
      res.json({ message: 'Size updated' });
    } catch (err) {
      console.error('Error updating size:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to update size', details: err.message });
    }
  };

  exports.deleteSize = async (req, res) => {
    try {
      const { id } = req.params;
      const size = await Size.findByPk(id);
      if (!size) throw new Error('Size not found');
      await size.destroy();
      res.json({ message: 'Size deleted' });
    } catch (err) {
      console.error('Error deleting size:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to delete size', details: err.message });
    }
  };