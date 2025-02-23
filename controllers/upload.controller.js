const express = require('express');
const cloudinary = require('../utils/cloudinary');
const upload = require('../middleware/multer');
const router = express.Router();

exports.uploadImage =  (req, res)=>{
  cloudinary.uploader.upload(req.file.path, function(err, result){
    if(err){
      console.log(err);
      res.status(400).json({
        status: 'fail',
        message: 'Error uploading file'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: result
    })
  })
}