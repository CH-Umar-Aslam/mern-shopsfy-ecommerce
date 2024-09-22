import express from 'express';
import { Cart } from '../models/Cart.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Add product to cart
router.post('/add-to-cart', auth(["admin", "user"]), async (req, res) => {
  const { productId, quantity } = req.body;


  console.log(req.user.userId)
  try {
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      // Update quantity if product is already in the cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

export default router;
