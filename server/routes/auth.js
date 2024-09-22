
import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const router = express.Router()
// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if an admin already exists
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(403).json({ msg: 'An admin already exists' });
      }
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: role || 'user'  // Default role is 'user'
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});


router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  password = password.toString();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });


    const payload = { _id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });


    res
      .cookie("access_token", token)
      .status(200)
      .json({
        user: user,
        token: token
      })




  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

export default router;