const express = require('express');
const router = express.Router();
const {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
} = require('../controllers/sizeController');

router.get('/', getSizes);
router.post('/', createSize);
router.put('/:id', updateSize);
router.delete('/:id', deleteSize);

module.exports = router;