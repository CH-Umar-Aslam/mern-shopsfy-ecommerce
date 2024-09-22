
// routes/admin.js
import express from 'express'
import auth from '../middleware/auth.js'


const router = express.Router()
// Admin only route
router.get('/admin', auth(['admin']), (req, res) => {
  res.json({ msg: 'Welcome Admin' });
});

export default router;
