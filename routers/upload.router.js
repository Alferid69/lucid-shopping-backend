const express = require('express')
const upload = require('../middleware/multer');
const { uploadImage } = require('../controllers/upload.controller');
const { protect } = require('../controllers/auth.controller');
const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;