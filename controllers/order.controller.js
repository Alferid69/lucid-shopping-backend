const Order = require("../models/orders.model");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handleFactory');

exports.setUserId = (req, res, next)=>{
  req.body.user = req.user.id;

  next();
}

// exports.createOrder = catchAsync(async (req, res, next) => {
//   const order = await Order.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       order,
//     },
//   });
// });

exports.createOrder = factory.createOne(Order);

exports.getOrder = factory.getOne(Order, {path: 'user'});
exports.getMyOrders = catchAsync(async (req, res) => {
  const myOrders = await Order.find({user: req.user.id})

  res.status(200).json({
    status: "success",
    data: {
      myOrders,
    },
  });
});


exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: 'success',
    data: {
      orders
    }
  })
})