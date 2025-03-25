import express from 'express';
import { Product } from '../../../common/interfaces';

const router = express.Router();

// Example product data
const products: Product[] = [
    { id: 1, name: 'Product 1', price: 99.99 },
    { id: 2, name: 'Product 2', price: 149.99 }
];

// Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

export default router; 