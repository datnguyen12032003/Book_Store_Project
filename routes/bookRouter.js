const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Books = require("../models/book");
const authenticate = require("../loaders/authenticate");
const Inventory = require("../models/inventory");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

//All books
bookRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
  })
  .get((req, res, next) => {
    Books.find({})
      .populate("comments.author", "fullname _id")
      .then(
        (books) => {
          if (books.length == 0) {
            res.json({ message: "No books found" });
          } else {
            res.json(books);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .post((req, res, next) => {
    Books.create(req.body)
      .then(
        Inventory.create({
          book: req.body._id,
          quantity: req.body.quantity,
          transaction_type: "Addition",
          description: "Initial stock",
        }),
        (book) => {
          console.log("Book Created ", book);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /books");
  })
  .delete((req, res, next) => {
    Books.deleteMany({})
      .then(
        (resp) => {
          console.log("Books removed");
          res.json({ message: "Deleted successfully!" }); // return the response
        },
        (err) => next(err) // pass the error to the error handler
      )
      .catch((err) => {
        next(err); // pass the error to the error handler
      });
  });

// Detail of a book
bookRouter
  .route("/:bookId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
  })
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .then(
        (book) => {
          if (book == null) {
            res.json({ message: "No book found" });
          } else {
            res.json(book);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /books/" + req.params.bookId);
  })
  .put(async (req, res, next) => {
    //nhập thêm số lượng sách
    Books.findById(req.params.bookId)
      .then(
        async (book) => {
          if (book != null) {
            await Inventory.create({
              book: req.params.bookId,
              quantity: req.body.quantity,
              transaction_type: "Addition",
              description: "Increase stock",
            });
            book.quantity += req.body.quantity;
            book.price = req.body.price;
            book.description = req.body.description;
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .delete((req, res, next) => {
    Books.findByIdAndDelete(req.params.bookId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ status: "Deleted successfully" });
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });

//Comments
bookRouter
  .route("/:bookId/comments")
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .then(
        (book) => {
          if (book != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            if (book.comments.length == 0) {
              res.json({ message: "No comments found" });
            } else {
              res.json(book.comments);
            }
          } else {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Books.findById(req.params.bookId).then(
      (book) => {
        if (book != null) {
          req.body.author = req.user._id; //add the author to the comment
          for (let i = 0; i < book.comments.length; i++) {
            if (
              book.comments[i].author.toString() === req.user._id.toString()
            ) {
              //check if the user has already commented
              res.statusCode = 403;
              res.setHeader("Content-Type", "application/json");
              res.json({ message: "You have already commented" });
              return;
            }
          }
          book.comments.push(req.body); //push the comment to the comments array

          let total = 0;
          for (let i = 0; i < book.comments.length; i++) {
            total += book.comments[i].rating;
          }
          book.total_rating = total / book.comments.length; //calculate the average rating

          book.save().then(
            (book) => {
              Books.findById(book._id)
                .populate("comments.author", "fullname _id")
                .then((book) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(book);
                });
            },
            (err) => next(err)
          );
        } else {
          err = new Error("Book " + req.params.bookId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /books/" + req.params.bookId + "/comments"
    );
  })
  .delete((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null) {
            for (var i = book.comments.length - 1; i >= 0; i--) {
              book.comments.id(book.comments[i]._id).deleteOne();
            }
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//Comment by ID
bookRouter
  .route("/:bookId/comments/:commentId")
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .then(
        (book) => {
          if (book != null && book.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book.comments.id(req.params.commentId));
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /books/" +
        req.params.bookId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null && book.comments.id(req.params.commentId) != null) {
            if (req.body.comment) {
              book.comments.id(req.params.commentId).comment = req.body.comment;
            }
            book.save().then(
              (book) => {
                Books.findById(book._id)
                  .populate("comments.author", "fullname _id")
                  .then((book) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(book);
                  });
              },
              (err) => next(err)
            );
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null && book.comments.id(req.params.commentId) != null) {
            book.comments.id(req.params.commentId).deleteOne();
            book.save().then(
              (book) => {
                Books.findById(book._id)
                  .populate("comments.author", "fullname _id")
                  .then((book) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(book);
                  });
              },
              (err) => next(err)
            );
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = bookRouter;
