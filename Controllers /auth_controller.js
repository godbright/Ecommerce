const { createError } = require("../Utils/err");
const { User } = require("../Models/user_model");
const { getStandardResponse } = require("../Utils/response");
const {
  hashpassword,
  checkPassword,
  assignToken,
} = require("../Utils/methods");

exports.register = async (req, res, next) => {
  //check if the username is already in the database
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      res.status(200).json(createError(200, "User already exist"));
    }
    //if the username is in the database validate the password and hash it

    const hashedPassword = await hashpassword(req.body.password);

    //register the user
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      profilePic: req.body.profilePic,
      role: req.body.role,
    });
    await user.save();

    const { password, ...others } = user._doc;

    return res
      .status(200)
      .json(getStandardResponse(200, "user found", others, req));
  } catch (error) {
    next(error);
  }

  //return the user object
};

exports.login = async (req, res, next) => {
  try {
    //check if the username provided belong to someone in the databse
    const userFound = await User.findOne({ username: req.body.username });

    if (!userFound)
      return res
        .status(200)
        .json(createError(400, "Username or Password is invalid"));

    //check if the password is correct
    const { password, _id, role, ...others } = userFound._doc;
    const isvalid = await checkPassword(req.body.password, password);
    //assign a jwt token to the user
    if (!isvalid)
      return res
        .status(401)
        .json(createError(401, "Username or password is invalid"));
    //login the user
    const token = await assignToken(_id, role);
    const data = { id: _id, role: role, others };

    return res
      .status(200)
      .json(
        getStandardResponse(200, "user", { user: data, token: token }, req)
      );
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    //check if the password input is correct
    const userFound = await User.findById(req.user.id);
    const hashedPasswordDb = userFound.password;

    const isvalid = await checkPassword(req.body.password, hashedPasswordDb);

    if (isvalid) {
      //check if the provided password is correct

      const hashedPassword = await hashpassword(req.body.new_password);

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: { password: hashedPassword },
        },
        { new: true }
      );

      const { password, ...others } = user._doc;

      res
        .json(
          getStandardResponse(
            200,
            "Password changed successfully ",
            others,
            req
          )
        )
        .status(200);
    } else {
      res.status(200).json(createError(404, "Invalid password provided"));
    }
  } catch (error) {
    next(error);
  }
};
