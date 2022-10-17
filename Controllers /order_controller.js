const { Order } = require("../Models/order_model");
const { User } = require("../Models/user_model");
const { createError } = require("../Utils/err");
const { getStandardResponse } = require("../Utils/response");

exports.CreateOrder = async (req, res, next) => {
  try {
    const order = await Order.create({
      userId: req.user.id,
      productId: req.params.id,
      quantity: req.body.quantity,
      orderStatus: req.body.orderStatus,
      comment: req.body.comment,
    });

    await order.save();
    //add the product to the user-product array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { order: req.params.id },
    });

    res
      .status(200)
      .json(getStandardResponse(200, "Order placed Successfully", order, req));
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    //give logged in user their own orders
    if (req.user.role == 3) {
      const orders = await Order.find({ userId: req.user.id });
      res
        .status(200)
        .json(getStandardResponse(200, "Your orders", orders, req));
    } else if (req.user.role == 1) {
      const orders = await Order.find().limit(20);
      res.status(200).json(getStandardResponse(200, "All orders", orders, req));
    }

    //give admin all the orders
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).json(getStandardResponse(200, "order", order, req));
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    //check if the order exist
    const orderFound = await Order.findById(req.params.id);
    if (!orderFound) return res.json(createError(404, "Order not found"));

    if (req.user.id == orderFound._doc.userId || req.user.role == 1) {
      const Updatedorder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res
        .status(200)
        .json(
          getStandardResponse(
            200,
            "Product updated Successfully",
            Updatedorder,
            req
          )
        );
    } else {
      res.status(401).json(createError(401, "Unauthorized"));
    }
  } catch (error) {
    next(error);
  }
};

exports.removeOrder = async (req, res, next) => {
  try {
    //check if the order exist
    const orderFound = await Order.findById(req.params.id);
    if (!orderFound) return res.json(createError(404, "Order not found"));

    if (req.user.id == orderFound._doc.userId || req.user.role == 1) {
      await Order.findByIdAndDelete(req.params.id);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { order: req.params.id },
      });
      res
        .status(200)
        .json(getStandardResponse(200, "Removed Successfully", [], req));
    } else {
      res.status(401).json(createError(401, "Unauthorized"));
    }
  } catch (error) {
    next(error);
  }
};
