const Order = require("../models/orders.model");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handleFactory');

exports.setUserId = (req, res, next)=>{
  req.body.user = req.user.id;

  next();
}

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order, {path: 'user'});
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);

exports.getMyOrders = catchAsync(async (req, res) => {
  const myOrders = await Order.find({user: req.user.id})

  res.status(200).json({
    status: "success",
    data: {
      myOrders,
    },
  });
});