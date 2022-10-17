const winston = require("winston");

exports.createError = (status, message) => {
  const err = new Error();
  err.message = message;
  err.status = status;
  //error
  //warn
  //info
  //verbose
  //debug
  winston.error(err.message, err);
  return err;
};
