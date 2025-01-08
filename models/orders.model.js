const mongoose = require("mongoose");
const Product = require("./products.model");
const AppError = require("../utils/appError");

const orderSchema = mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {type: String},
      price: { type: Number }, 
      quantity: { type: Number, required: true, min: 1 }
    },
  ],
  totalPrice: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now }, 
  // address: { type: String, required: [true, "Address field cannot be empty!"] },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  }
},
{
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
}
);

orderSchema.pre(/^find/, function(next){
  this.populate({
    path: 'products',
  })
  // this.populate({
  //   path: 'user',
  //   select: 'firstName lastName email'
  // })

  next();
});


orderSchema.pre("save", async function (next) {
  try {
    this.totalPrice = 0;
    // Check the available quantity for each product
    for (const item of this.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new Error(`Product with ID ${item.productId} not found.`));
      }
      
      if (product.availableQuantity < item.quantity) {
        return next(
          new AppError(
            `Product "${product.name}" does not have enough stock. Available: ${product.availableQuantity}, Requested: ${item.quantity}.`, 400
          )
        );
      }
      item.name = product.name;
      item.price = product.price;
      // Add to totalPrice
      this.totalPrice += product.price * item.quantity;
    }
    next();
  } catch (err) {
    next(err);
  }
});


orderSchema.post("save", async function (doc, next) {
  try {
    for (const item of doc.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableQuantity: -item.quantity },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
