import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the CartItem schema
const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

// Define the Cart schema
const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true

  },
  items: [cartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0
  }
});

// Middleware to calculate total price before saving
cartSchema.pre('save', function (next) {
  this.total = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  next();
});

// Create the models
const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

export { Cart, CartItem };
