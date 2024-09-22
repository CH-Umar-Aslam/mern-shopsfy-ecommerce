// routes/user.js
import express from 'express';

import auth from '../middleware/auth.js';


const router = express.Router()
// User route (both user and admin can access)
router.get('/user', auth(['user', 'admin']), (req, res) => {
  res.json({ msg: 'Welcome User' });
});

export default router;
