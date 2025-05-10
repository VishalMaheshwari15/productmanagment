const Material = require('../models/Material');

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll(); // Using Sequelize's findAll
    res.json(materials);
  } catch (err) {
    console.error('Error fetching materials:', err.message, err.stack); // Detailed logging
    res.status(500).json({ error: 'Failed to fetch materials', details: err.message });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('Material name is required');
    const material = await Material.create({ name });
    res.status(201).json({ id: material.id, message: 'Material added' });
  } catch (err) {
    console.error('Error creating material:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to add material', details: err.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) throw new Error('Material name is required');
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Material not found');
    await material.update({ name });
    res.json({ message: 'Material updated' });
  } catch (err) {
    console.error('Error updating material:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update material', details: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Material not found');
    await material.destroy();
    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error('Error deleting material:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete material', details: err.message });
  }
};