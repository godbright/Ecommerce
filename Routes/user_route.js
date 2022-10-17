const express = require("express");

const {
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  getSellers,
  addToCart,
  removeFromCart,
  removeFromFavorate,
  addToFavorate,
} = require("../Controllers /users_controller");
const { verifyToken } = require("../Utils/methods");
const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUser);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.get("/getSellers", getSellers);
router.put("/addToCart/:id", verifyToken, addToCart);
router.put("/removeFromCart/:id", verifyToken, removeFromCart);
router.put("/removeFromFavorate/:id", verifyToken, removeFromFavorate);
router.put("/addToFavorate/:id", verifyToken, addToFavorate);

module.exports = router;
