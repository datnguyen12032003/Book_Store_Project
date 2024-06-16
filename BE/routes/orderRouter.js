const express = require("express");
const bodyParser = require("body-parser");
const Order = require("../models/order");
const authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const orderRouter = express.Router();

orderRouter.use(bodyParser.json());

orderRouter.get("/", cors.cors, authenticate.verifyUser, (req, res, next) => {
  Order.find({ user: req.user._id })
    .populate("user", "fullname")
    .populate("order_details.book", "_id title author price imageurls")
    .then(
      (order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
//   .post(
//     "/",
//     cors.corsWithOptions,
//     authenticate.verifyUser,
//     async (req, res, next) => {
//       try {
//         let order = await Order.create({
//           user: req.user._id,
//           total_price: req.body.total_price,
//           address: req.user.address,
//           phone: req.user.phone,
//           order_details: req.body.order_details,
//         });
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json(order);
//       } catch (err) {
//         next(err);
//       }
//     }
//   );

module.exports = orderRouter;
