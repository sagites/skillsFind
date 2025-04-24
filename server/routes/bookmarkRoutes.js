const express = require('express');
const router = express.Router();
const {
  bookmarkVendor,
  unbookmarkVendor,
  getBookmarkedVendors,
} = require('../controllers/bookmarkController');

const protect = require('../middleware/protect');

// Protected Routes
router.post('/', protect, bookmarkVendor);
router.post('/unbookmark', protect, unbookmarkVendor);
router.get('/bookmarks', protect, getBookmarkedVendors);

module.exports = router;
