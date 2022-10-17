const express = require("express");
const {
  GetAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  searchProduct,
  addToCart,
  getFavorateList,
  getCartList,
  ApproveProduct,
  getApprovedProducts,
} = require("../Controllers /products_controller");

const { verifyUser, verifyAdmin, verifyToken } = require("../Utils/methods");
const router = express.Router();

router.get("/allproducts", GetAllProducts);
router.post("/createProduct/:id", verifyToken, createProduct);
router.post("/getProduct/:id", getProduct);
router.put("/updateProduct/:id", verifyToken, updateProduct);
router.get("/searchProduct", searchProduct);
router.get("/getFavorateList", verifyToken, getFavorateList);
router.get("/getCartList", verifyToken, getCartList);
router.put("/approveProduct/:id", verifyAdmin, ApproveProduct);
router.get("/getApprovedList", verifyAdmin, getApprovedProducts);

module.exports = router;

//TODO All the seller functionality you have to
//check if the role of the user id 2 otherwise
// they are not authorized
