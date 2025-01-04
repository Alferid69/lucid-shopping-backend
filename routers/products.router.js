const express = require("express");
const reviewRouter = require('./review.router')
const {
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  aliasTopProducts,
  createProduct,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../controllers/auth.controller");

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router.route('/top-5-products').get(aliasTopProducts, getAllProducts)

router.use(protect);
router.get("/:id", getProduct)
router.get('/', getAllProducts)

router.use(restrictTo('admin'));
router.post('/', createProduct);
router.route("/:id").delete(deleteProduct).patch(updateProduct);

module.exports = router;
