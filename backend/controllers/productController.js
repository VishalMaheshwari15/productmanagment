  // backend/controllers/productController.js
  let products = [
    { id: 1, name: 'Product 1', price: 100, quantity: 10, categoryId: 1, Category: { name: 'Category 1' } },
    { id: 2, name: 'Product 2', price: 200, quantity: 20, categoryId: 2, Category: { name: 'Category 2' } },
  ];
  let nextProductId = 3;

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

      let filteredProducts = [...products];

      if (categoryId) filteredProducts = filteredProducts.filter(p => p.categoryId === parseInt(categoryId));
      if (materialId) filteredProducts = filteredProducts.filter(p => p.materialId === parseInt(materialId));
      if (colorId) filteredProducts = filteredProducts.filter(p => p.colorId === parseInt(colorId));
      if (sizeId) filteredProducts = filteredProducts.filter(p => p.sizeId === parseInt(sizeId));
      if (minPrice || maxPrice !== Infinity) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice) && p.price <= (parseFloat(maxPrice) || Infinity));
      }
      if (minQuantity || maxQuantity !== Infinity) {
        filteredProducts = filteredProducts.filter(p => p.quantity >= parseInt(minQuantity) && p.quantity <= (parseInt(maxQuantity) || Infinity));
      }

      filteredProducts.sort((a, b) => {
        if (order.toUpperCase() === 'ASC') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        }
        return a[sortBy] < b[sortBy] ? 1 : -1;
      });

      const start = (parseInt(page) - 1) * parseInt(limit);
      const end = start + parseInt(limit);
      const paginatedProducts = filteredProducts.slice(start, end);

      res.json({ products: paginatedProducts, total: filteredProducts.length });
    } catch (err) {
      console.error('Error fetching products:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
  };

  exports.createProduct = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

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

      if (!name) throw new Error('Name is required');
      if (!price || price <= 0) throw new Error('Valid price is required');
      if (!quantity || quantity < 0) throw new Error('Valid quantity is required');
      if (!categoryId) throw new Error('Category is required');

      const product = {
        id: nextProductId++,
        name,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        quantity: parseInt(quantity),
        image,
        description: description || null,
        specification: specification || null,
        categoryId: parseInt(categoryId),
        materialId: materialId ? parseInt(materialId) : null,
        colorId: colorId ? parseInt(colorId) : null,
        sizeId: sizeId ? parseInt(sizeId) : null,
        Category: { name: `Category ${categoryId}` },
        Material: materialId ? { name: `Material ${materialId}` } : null,
        Color: colorId ? { name: `Color ${colorId}` } : null,
        Size: sizeId ? { name: `Size ${sizeId}` } : null,
      };

      products.push(product);
      console.log('Product created:', product);
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

      const productIndex = products.findIndex(p => p.id === parseInt(id));
      if (productIndex === -1) throw new Error('Product not found');

      products[productIndex] = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        price: price ? parseFloat(price) : products[productIndex].price,
        oldPrice: oldPrice ? parseFloat(oldPrice) : products[productIndex].oldPrice,
        quantity: quantity ? parseInt(quantity) : products[productIndex].quantity,
        image: image || products[productIndex].image,
        description: description || products[productIndex].description,
        specification: specification || products[productIndex].specification,
        categoryId: categoryId ? parseInt(categoryId) : products[productIndex].categoryId,
        materialId: materialId ? parseInt(materialId) : products[productIndex].materialId,
        colorId: colorId ? parseInt(colorId) : products[productIndex].colorId,
        sizeId: sizeId ? parseInt(sizeId) : products[productIndex].sizeId,
        Category: { name: `Category ${categoryId || products[productIndex].categoryId}` },
        Material: materialId ? { name: `Material ${materialId}` } : products[productIndex].Material,
        Color: colorId ? { name: `Color ${colorId}` } : products[productIndex].Color,
        Size: sizeId ? { name: `Size ${sizeId}` } : products[productIndex].Size,
      };

      res.json({ message: 'Product updated' });
    } catch (err) {
      console.error('Error updating product:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const productIndex = products.findIndex(p => p.id === parseInt(id));
      if (productIndex === -1) throw new Error('Product not found');
      products.splice(productIndex, 1);
      res.json({ message: 'Product deleted' });
    } catch (err) {
      console.error('Error deleting product:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to delete product', details: err.message });
    }
  };