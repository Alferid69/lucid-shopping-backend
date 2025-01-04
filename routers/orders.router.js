const express = require("express");
const {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  setUserId,
} = require("../controllers/order.controller");
const { protect } = require("../controllers/auth.controller");

const router = express.Router();

router.use(protect);
router.get('/', getAllOrders)
router.route("/new").post(setUserId,createOrder);
router.route("/my-orders").get(getMyOrders);
router.route("/:id").get(getOrder);


module.exports = router;