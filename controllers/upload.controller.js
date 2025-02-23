const express = require("express");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const User = require("../models/user.model");
const router = express.Router();

exports.uploadImage = (req, res) => {
  cloudinary.uploader.upload(req.file.path, async function (err, result) {
    if (err) {
      console.log(err);
      res.status(400).json({
        status: "fail",
        message: "Error uploading file",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      data: result,
    });

    await User.findByIdAndUpdate(req.user._id, { photo: result.url });
  });
};
