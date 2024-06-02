const express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/book");
const authenticate = require("../loaders/authenticate");
const upload = require("../loaders/upload");
const cors = require("../loaders/cors");

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/many/:bookId")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.array("image", 4), //upload nhieu file anh voi key la image
    (req, res, next) => {
      //req.files: mang chua cac file anh duoc upload
      Books.findById(req.params.bookId).then((book) => {
        if (book) {
          if (book.imageurls.length >= 4) {
            // If the book already has 5 images, return an error
            let err = new Error("Book already has 4 images");
            err.status = 400;
            return next(err);
          }
          req.files.forEach((file) => {
            //duyet qua tung file
            return book.imageurls.push({
              book: req.params.bookId,
              imageUrl: file.path,
            });
          });
          book
            .save() //luu lai book sau khi them cac imageurl
            .then((book) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(book.imageurls);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Book ${req.params.bookId} not found`);
          err.status = 404;
          return next(err);
        }
      });
    }
  );

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/:bookId")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin, //chi admin moi co quyen upload
    upload.single("image"), //upload 1 file anh voi key la image
    (req, res, next) => {
      Books.findById(req.params.bookId) //tim book co id la bookId
        .then((book) => {
          if (book) {
            if (book.imageurls.length >= 4) {
              //neu book da co 4 anh
              let err = new Error("Book already has 4 images");
              err.status = 400;
              return next(err);
            }

            book.imageurls.push({
              book: req.params.bookId,
              imageUrl: req.file.path,
            });
            book
              .save() //luu lai book sau khi them imageurl
              .then((book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book.imageurls);
              })
              .catch((err) => next(err));
          }
        });
    }
  );

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/:bookId/:imageId")
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.findById(req.params.bookId) //tim book co id la bookId
        .then((book) => {
          if (book) {
            const image = book.imageurls.id(req.params.imageId); //tim image co id la imageId
            if (image) {
              book.imageurls.id(req.params.imageId).deleteOne();
              book
                .save()
                .then(() => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ message: "Image deleted successfully" });
                })
                .catch((err) => next(err));
            } else {
              err = new Error(`Image ${req.params.imageId} not found`);
              err.status = 404;
              return next(err);
            }
          } else {
            err = new Error(`Book ${req.params.bookId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

module.exports = uploadRouter;
