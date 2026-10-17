import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

const emailProvider = {
  send: async (message) => {
    console.log('[EMAIL] ' + message);
  }
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    if (req.query.all === 'true') {
      return res.json(products);
    }

    const available = products.filter((product) => {
      return product.stock > 0 && product.status === 'available';
    });

    res.json(available);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

router.get('/:id/shipping-cost', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Producto no encontrado');

    const isProduction = false;
    const SHIPPING_API_KEY = 'shipnow_shipping_key_123';
    if (!SHIPPING_API_KEY) return res.status(500).send('Falta API key');

    const shippingCost = isProduction ? 50 + product.price * 0.01 : 10;

    res.json({ product: product._id, declaredValue: product.price, shippingCost });
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.title || !req.body.code || req.body.price === undefined) {
      return res.status(400).send('Faltan campos obligatorios');
    }
    if (req.body.price < 0) return res.status(400).send('Precio inválido');

    const existing = await Product.findOne({ code: req.body.code });
    if (existing) return res.status(400).json({ status: 'error', data: null });

    const stock = req.body.stock || 0;

    const newProduct = await Product.create({
      ...req.body,
      stock,
      status: stock > 0 ? 'available' : 'out_of_stock'
    });

    await emailProvider.send('Producto creado: ' + newProduct.title);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.status === 'Out_of_stock' || req.body.status === 'OUT_OF_STOCK') {
      req.body.status = 'out_of_stock';
    }

    if (req.body.stock !== undefined) {
      req.body.status = req.body.stock > 0 ? 'available' : 'out_of_stock';
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

export default router;
