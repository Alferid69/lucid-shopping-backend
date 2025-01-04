const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handleFactory')

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.find({_id: req.user.id}).populate('orders');

  res.status(200).json({
    status: 'success',
    data: {
      user: me
    }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route can not be used to update password. Please use /updateMyPassword",
        400
      )
    );
  }

  const updatedUserData = {
    firstName: req.body?.firstName || req.user.firstName,
    lastName: req.body?.lastName || req.user.lastName,
    email: req.body?.email || req.user.email,
    phone: req.body?.phone || req.user.phone,
    address: req.body?.address || req.user.address,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updatedUserData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null
  })
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);