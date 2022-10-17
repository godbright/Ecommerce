const { Product } = require("../Models/product_model");
const { User } = require("../Models/user_model");
const { getStandardResponse } = require("../Utils/response");

exports.getUsers = async (req, res, next) => {
  try {
    const { password, ...other } = await User.find();

    return res
      .status(200)
      .json(getStandardResponse(200, "Users Found", other, req));
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(200)
        .json(getStandardResponse(200, "User not found", [], req));

    return res
      .status(200)
      .json(getStandardResponse(200, "User found", user, req));
  } catch (error) {
    next(error);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json(getStandardResponse(200, "User was deleted ", [], req));
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const { password, ...other } = user._doc;
    return res
      .status(200)
      .json(getStandardResponse(200, "User was updated", other, req));
  } catch (error) {
    next(error);
  }
};

//list of sellers
exports.getSellers = async (req, res, next) => {
  try {
    //filter all users who have the role of 2
    const sellers = await User.find({ role: 2 });

    const { password, ...others } = sellers;

    res
      .status(200)
      .json(getStandardResponse(200, "Sellers found", others, req));
  } catch (error) {
    next(error);
  }
};
//add to cart
exports.addToCart = async (req, res, next) => {
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { cart: req.params.id },
      },
      { new: true }
    );
    res.status(200).json(getStandardResponse(200, "Cart Items ", [], req));
  } catch (error) {
    next(error);
  }
};

//remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: req.params.id },
    });
    res
      .status(200)
      .json(getStandardResponse(200, "Product removed from cart", [], req));
  } catch (error) {
    next(error);
  }
};

//add to favorate
exports.addToFavorate = async (req, res, next) => {
  try {
    //the id of the logged in user to  check it and update its favorate info
    const userId = req.user.id;
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { favorate: req.params.id },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(getStandardResponse(200, "Added to favorate", [], req));
  } catch (error) {
    next(error);
  }
};

//remove from favorate
exports.removeFromFavorate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, {
      $pull: { favorate: req.params.id },
    });
    return res.json(
      getStandardResponse(200, "Removed from favorate list", [], req)
    );
  } catch (error) {
    next(error);
  }
};
