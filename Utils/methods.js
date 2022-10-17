const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createError } = require("./err");

exports.hashpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.assignToken = async (id, role) => {
  const user = {
    id: id,
    role: role,
  };
  return await jwt.sign(user, process.env.jwtSecret);
};

exports.verifyToken = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    res.json(createError(400, "No token found"));
  }

  await jwt.verify(req.body.token, process.env.jwtSecret, (err, user) => {
    if (err) return res.json(createError(401, "Invalid token provided"));
    req.user = user;

    next();
  });
};

//only verify the user who has sent their id on the params
exports.verifyUser = async (req, res, next) => {
  this.verifyToken(req, res, () => {
    //if the user is the one logged in
    if (req.user.id === req.params.id) {
      next();
    } else if (req.user.role === 1) {
      next();
    } else return res.json(createError(403, "You are not authorized"));
  });
};

exports.verifyAdmin = async (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.role === 1) {
      next();
    } else {
      res.json(createError(403, "Unauthorized"));
    }
  });
};
