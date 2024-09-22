// models/Product.js
import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  productType: {
    type: String,
    required: true,
    enum: ['latest', 'popular', 'common', 'exclusive'],
    default: 'common',

  },
  stock: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
      unique: true,
    },

  ]
}, { timestamps: true });



const Product = mongoose.model('Product', productSchema);

export default Product;
