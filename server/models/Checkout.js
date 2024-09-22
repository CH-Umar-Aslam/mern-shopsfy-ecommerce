import mongoose from "mongoose";
import User from "./User";
import Product from "./Product";


const CheckoutSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}, { timestamps: true })