const express = require("express");
const {
  CreateOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  removeOrder,
} = require("../Controllers /order_controller");
const { verifyToken, verifyAdmin } = require("../Utils/methods");
const router = express.Router();

router.post("/createOrder/:id", verifyToken, CreateOrder);
router.get("/getAllOrders", [verifyToken, verifyAdmin], getAllOrders);
router.get("/getOrder/:id", getOrder);
router.put("/updateOrder/:id", [verifyToken, verifyAdmin], updateOrder);
router.put("/removeOrder/:id", [verifyToken, verifyAdmin], removeOrder);

module.exports = router;
