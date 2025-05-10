const express = require('express');
const router = express.Router();
const {
  getColors,
  createColor,
  updateColor,
  deleteColor,
} = require('../controllers/colorController');

router.get('/', getColors);
router.post('/', createColor);
router.put('/:id', updateColor);
router.delete('/:id', deleteColor);

module.exports = router;