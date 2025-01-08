const express = require("express");
const {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  setUserId,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../controllers/auth.controller");

const router = express.Router();

router.use(protect);
router.route("/new").post(setUserId,createOrder);
router.route("/my-orders").get(getMyOrders);
router.route("/:id").get(getOrder);

router.use(restrictTo("admin"));
router.get('/', getAllOrders)
router.route("/:id").patch(updateOrder).delete(deleteOrder);


module.exports = router;