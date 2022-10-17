const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    orderStatus: { type: String, default: "pending" },
    comment: { type: String },
  },
  { timestap: true }
);

const Order = mongoose.model("Order", OrderSchema);
exports.Order = Order;
