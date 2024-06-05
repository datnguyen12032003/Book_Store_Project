const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var orderDetailSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

var orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  total_price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  order_status: {
    type: String,
    default: "Waiting", //waiting là chờ xác nhận
  },
  order_details: [orderDetailSchema],
});

var Order = mongoose.model("Order", orderSchema);
module.exports = Order;
