import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';
import Product from '../models/Product.js';

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', auth(["admin"]), upload.array('images', 4), async (req, res) => {
  const { name, price, description, stock, category, productType } = req.body;

  try {
    // Array to hold all the Cloudinary URLs
    const imageUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'user_profiles' }, // Optional: specify folder in Cloudinary
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );

          // Pass the buffer of the image file to Cloudinary
          stream.end(file.buffer);
        });
      })
    );

    // Create a new product and save the array of Cloudinary URLs to MongoDB
    const newProduct = new Product({
      name,
      price,
      images: imageUrls, // Store all Cloudinary URLs in an array
      description,
      category,
      createdBy: req.user._id,
      productType,
      stock
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product uploaded and saved successfully!',
      newProduct,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to upload and save product', error });
  }
});

export default router;
