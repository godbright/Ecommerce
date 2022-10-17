const winston = require("winston");
module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  //connect to the database
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
  });
  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
  });
};
