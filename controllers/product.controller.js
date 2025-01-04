const Product = require("../models/products.model");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handleFactory')

exports.aliasTopProducts = (req, res, next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-ratingsQuantity,price';
  req.query.fields = 'name,price,ratingsAverage,ratingsQuantity,category,description'
  next();
}

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, {path: 'reviews'});
exports.deleteProduct = factory.deleteOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);