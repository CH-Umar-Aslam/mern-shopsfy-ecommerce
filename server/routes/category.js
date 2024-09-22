import express from 'express'
import auth from '../middleware/auth.js'
const router = express.Router()
import Category from "../models/Category.js"

router.post('/add', auth(['admin']), async (req, res) => {

  const { name } = req.body;
  const category = new Category({ name });
  await category.save()
  return res.json(category).status(200)


})
router.post('/get', auth(['admin']), async (req, res) => {

  const categories = await Category.find();

  return res.json(categories).status(200)


})
export default router