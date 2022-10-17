const { default: mongoose } = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  IsFeatured: { type: Boolean },
  desc: { type: String },
  isApproved: { type: Boolean },
  sellerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  image: [String],
});

const Product = mongoose.model("Product", ProductSchema);

module.exports.Product = Product;
