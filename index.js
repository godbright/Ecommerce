const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const winston = require("winston");

const AuthRoute = require("./Routes/auth_route");
const UserRoute = require("./Routes/user_route");
const ProductsRoute = require("./Routes/products_route");
const OrdersRoute = require("./Routes/orders_route");
dotenv.config();

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
const connect = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("database was connected ");
  });
};
app.use(express.json());

//login and register
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/products", ProductsRoute);
app.use("/api/orders", OrdersRoute);

//error middleware

app.use((err, req, res, next) => {
  const { status, message, stack } = err;

  winston.error(message, err);
  res.status(status || 500).json({
    message: message || "Something went wrong",
    status: status,
    stack: stack,
  });
});

require("./Utils/prod")(app);

//establish a local server connection
const port = process.env.PORT || 8080;
app.listen(port, () => {
  connect();
  console.log(`listening at port  ${port}`);
});
