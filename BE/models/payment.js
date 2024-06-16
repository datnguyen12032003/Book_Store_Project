const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var paymentSchema = new mongoose.Schema(
  {
    TxnRef: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    payment_status: {
      type: String,
      default: "Pending", //pending là chưa thanh toán
    },
  }
  // {
  //   timestamps: true,
  // }
);

var Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
