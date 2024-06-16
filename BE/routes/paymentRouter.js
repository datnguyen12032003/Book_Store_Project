/**
 * Created by CTT VNPAY
 */

let express = require("express");
let paymentRouter = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
var Payment = require("../models/payment");
var Book = require("../models/book");
var Inventory = require("../models/inventory");
var Order = require("../models/order");
var authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/create_payment_url")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async function (req, res, next) {
      process.env.TZ = "Asia/Ho_Chi_Minh";

      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");
      console.log(createDate);

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let config = require("../configs/config");

      let tmnCode = config.vnp_TmnCode;
      let secretKey = config.vnp_HashSecret;
      let vnpUrl = config.vnp_Url;
      let returnUrl = config.vnp_ReturnUrl;
      let orderId = moment(date).format("DDHHmmss");
      let amount = req.body.amount;
      let bankCode = "VNBANK";

      let locale = "vn";
      if (locale === null || locale === "") {
        locale = "vn";
      }
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      let bookId = req.body.bookId;
      let userId = req.user._id;
      let quantity = req.body.quantity;
      let total_price = amount;
      await Order.create({
        user: userId,
        TxnRef: orderId,
        total_price: total_price,
        address: req.user.address,
        phone: req.user.phone,
        order_details: req.body.order_details.map((detail) => ({
          book: detail.book,
          order_quantity: detail.order_quantity,
          order_price: detail.order_price,
        })),
      }).then(async (order) => {
        await Payment.create({
          TxnRef: orderId,
          order: order._id,
          book: bookId,
          user: userId,
          quantity: quantity,
          total_price: total_price,
        });
      });

      res.end(vnpUrl);
    }
  );

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/vnpay_info", cors.cors, function (req, res, next) {
    let vnp_TransactionStatus = req.query.vnp_TransactionStatus;
    let TxnRef = req.query.vnp_TxnRef;

    Payment.findOne({ TxnRef: TxnRef })
      .then((payment) => {
        if (payment) {
          payment.payment_status =
            vnp_TransactionStatus == "00" ? "Success" : "Fail";
          return payment.save();
        } else {
          throw new Error("Payment not found");
        }
      })
      .then(async (payment) => {
        if (payment.payment_status === "Success") {
          await Inventory.create({
            book: payment.book,
            quantity: payment.quantity,
            transaction_type: "Sell",
          });
          await Order.findOneAndUpdate(
            { TxnRef: TxnRef },
            { order_status: "Success" }
          );
        } else {
          await Order.findOneAndUpdate(
            { TxnRef: TxnRef },
            { order_status: "Fail" }
          ).then(async (order) => {
            //tra lai so luong sach
            order.order_details.forEach(async (detail) => {
              Book.findById(detail.book).then(async (book) => {
                book.quantity += detail.order_quantity;
                await book.save();
              });
            });
          });
        }
      })
      .then(() => {
        if (vnp_TransactionStatus == "00") {
          res.status(200).json({ Message: "Success" });
        } else {
          res.status(200).json({ Message: "Failed" });
        }
      })
      .catch((err) => {
        res.status(500).json({ RspCode: "500", Message: err.message });
      });
  });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = paymentRouter;
