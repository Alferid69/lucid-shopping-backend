const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name can not be empty!"],
      trim: true,
      maxLength: [32, "Product name too long! use <= 32 characters only!"],
      minLength: [7, "Product name too short! use >= 7 characters at least!"],
    },
    description: {
      type: String,
      required: [true, "Product description can not be empty!"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category can not be empty!"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price can not be empty!"],
    },
    availableQuantity: {
      type: Number,
      min: [1, "Available number of product is too low!"],
    },
    ratingsAverage: {
      type: Number,
      default: 5.0,
      min: [1.0, "Product's rating can not be < 1.0!"],
      max: [5.0, "Product's rating can not be > 5.0!"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    imageUrl: {
      type: String,
      default:
        "https://sxtmjciywqxfdimmohke.supabase.co/storage/v1/object/public/products/sweater.jpg?t=2024-10-24T10%3A13%3A24.636Z",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
