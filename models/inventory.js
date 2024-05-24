const mongoose = require("mongoose");
const { trace } = require("../routes");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  quantity: {
    type: Number,
    required: true,
  },
  transaction_type: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
