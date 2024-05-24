const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    total_rating: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Books = mongoose.model("Books", bookSchema);
module.exports = Books;
