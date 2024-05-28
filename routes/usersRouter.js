var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../loaders/authenticate");

router.use(bodyParser.json());

//Sign up
router.post("/signup", (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      //đăng ký người dùng
      if (err) {
        //nếu có lỗi
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body) {
          user.fullname = req.body.fullname;
          user.email = req.body.email;
          user.phone = req.body.phone;
          user.address = req.body.address;
          user.admin = req.body.admin;
        }
        user
          .save()
          .then(() => {
            passport.authenticate("local")(req, res, () => {
              //đăng nhập người dùng sau khi đăng ký
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          })
          .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          });
      }
    }
  );
});

//Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  // res.json({
  //   success: true,
  //   token: token,
  //   status: "You are successfully logged in!",
  // });
  res.end(token);
});

//Log out
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy;
    res.clearCookie("session-id");
    res.setHeader("Content-Type", "application/json");
    res.json({
      status: "You are successfully logged out!",
    });
  } else {
    var err = new Error("You are not login!");
    err.status = 401;
    return next(err);
  }
});

//change password
router
  .route("/changePassword")
  .post(authenticate.verifyUser, (req, res, next) => {
    User.findOne({
      _id: req.user._id,
    })
      .then((user) => {
        user.changePassword(
          req.body.oldPassword,
          req.body.newPassword,
          (err) => {
            res.setHeader("Content-Type", "application/json");
            if (err) {
              res.statusCode = 500;
              if (err.name === "IncorrectPasswordError") {
                res.json({ err: { message: "Incorrect password" } });
              } else {
                res.json({ err: err });
              }
            } else {
              res.statusCode = 200;
              res.json({
                success: true,
                status: "Change password successful!",
              });
            }
          }
        );
      })
      .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      });
  });
module.exports = router;
