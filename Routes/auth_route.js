const express = require("express");
const router = express.Router();

const {
  register,
  login,
  changePassword,
} = require("../Controllers /auth_controller");
const { verifyToken } = require("../Utils/methods");

router.post("/register", register);
router.post("/login", login);
router.put("/changePassword", verifyToken, changePassword);

module.exports = router;
