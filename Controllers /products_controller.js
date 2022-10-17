const { Product } = require("../Models/product_model");
const { User } = require("../Models/user_model");
const { createError } = require("../Utils/err");
const { getStandardResponse } = require("../Utils/response");
//get all products regardless
exports.GetAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res
      .status(200)
      .json(getStandardResponse(200, "Products found ", products, req));
  } catch (error) {
    next(error);
  }
};

//get a single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    return res
      .status(200)
      .json(getStandardResponse(200, "product found", product, req));
  } catch (err) {
    next(err);
  }
};

//create a product
exports.createProduct = async (req, res, next) => {
  try {
    if (req.user.role === 2 || req.user.role == 1) {
      const product = await Product.create({
        sellerId: req.user.id,
        ...req.body,
      });
      await product.save();
      return res
        .status(200)
        .json(getStandardResponse(200, "Product created", product, req));
    } else {
      res.json(createError(403, "Unauthorized")).status(200);
    }
  } catch (err) {
    next(err);
  }
};

//update product information
exports.updateProduct = async (req, res, next) => {
  try {
    //check if the product exist

    const productFound = await Product.findById(req.params.id);

    if (!productFound)
      return res.json(getStandardResponse(200, "Product not found", [], req));

    if (req.user.id == productFound.sellerId || req.user.role === 1) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.json(
        getStandardResponse(200, "Product updated", updatedProduct, req)
      );
    } else return res.status(401).json(createError(401, "Unauthorized"));
  } catch (error) {
    next(error);
  }
};

//search product by name
exports.searchProduct = async (req, res, next) => {
  let query = req.query.q;
  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    }).limit(20);

    res
      .status(200)
      .json(getStandardResponse(200, "Search result", products, req));
  } catch (error) {
    next(error);
  }
};

//make product order

//get list of products in favorate list
exports.getFavorateList = async (req, res, next) => {
  try {
    //get logged in user id
    const userId = req.user.id;

    // get ids of products from the favorate products array
    const user = await User.findById(userId);

    const favorateIds = user.favorate;
    //retrieve the list of products with the particular id.
    console.log(favorateIds);
    const list = await Promise.all(
      favorateIds.map((favorateId) => {
        return Product.find({ _id: favorateId });
      })
    );

    console.log(list);

    res
      .status(200)
      .json(getStandardResponse(200, "FavorateList", list.flat(), req));
  } catch (error) {
    next(error);
  }
};

//get list of cart products

exports.getCartList = async (req, res, next) => {
  try {
    //get the logged in user id
    const userId = req.user.id;

    //get the user with that id
    const user = await User.findById(userId);

    //get element in cart
    const cartItems = user.cart;
    //find the products with that cart item id inside
    const cartList = await Promise.all(
      cartItems.map((cartItem) => {
        return Product.findById(cartItem);
      })
    );
    return res
      .status(200)
      .json(getStandardResponse(200, "Cart items ", cartList, req));
  } catch (error) {
    next(error);
  }
};

//aprove product wgich can be done by admin only
exports.ApproveProduct = async (req, res, next) => {
  try {
    //check if the product exist

    const productFound = await Product.findById(req.params.id);

    if (!productFound)
      return res.json(getStandardResponse(200, "Product not found", [], req));

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    return res.json(
      getStandardResponse(200, "Product updated", updatedProduct, req)
    );
  } catch (error) {
    next(error);
  }
};

//list of approved products

exports.getApprovedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isApproved: true });
    res
      .status(200)
      .json(getStandardResponse(200, "Aproved Products", products, req));
  } catch (error) {
    next(error);
  }
};
