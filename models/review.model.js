const mongoose = require("mongoose");
const Product = require("./products.model");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review text is required"],
    },
    rating: {
      type: Number,
      min: [1, "Rating can not be lower than 1!"],
      max: [5, "Rating can not be higher than 5!"],
      required: [true, "Rating field is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "A review must be about a product!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A reviewer is required!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// i think the below fn runs because we populate reviews inside product fetching, which in turn query for reviews
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'product', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'firstName lastName',
  // });
  // we don't need to populate the tour
  this.populate({
    path: "user",
    select: "firstName lastName",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Store the document before running the query
  this.r = await this.model.findOne(this.getFilter()); // Safe execution
  if (!this.r) {
    return next(new AppError("Document not found"));
  }
  next();
});

// Post-hook: Update product ratings after the query is executed
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
