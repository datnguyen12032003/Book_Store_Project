var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../loaders/authenticate");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("../loaders/cors");

router.use(bodyParser.json());
//login google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    if (req.user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ mess: "Login success!" });
    } else {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: "Login failed!" });
    }
  }
);

router.get("/callback", passport.authenticate("google"), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(token);
});

//Sign up
router
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post("/signup", cors.corsWithOptions, (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: "Email already exists!" });
        } else {
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
                      res.json({
                        success: true,
                        status: "Registration Successful!",
                      });
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
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      });
  });

//Login
router
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(
    "/login",
    cors.corsWithOptions,
    passport.authenticate("local"),
    (req, res) => {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      // res.json({
      //   success: true,
      //   token: token,
      //   status: "You are successfully logged in!",
      // });
      res.end(token);
    }
  );

//Log out
router
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/logout", cors.cors, (req, res) => {
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
  .post(authenticate.verifyUser, cors.corsWithOptions, (req, res, next) => {
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

//forgot password
router.post("/forgotPassword", cors.corsWithOptions, (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "Email not exists!" });
      } else {
        const otp = crypto.randomBytes(3).toString("hex");
        user.resetPasswordOTP = otp; //generate OTP
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

        user.save().then(() => {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "datnptce171966@fpt.edu.vn",
              pass: "apny unoj uums pybe",
            },
          });

          let mailOptions = {
            to: user.email,
            from: "mailcuadatnguyen@gmail.com",
            subject: "OTP for reset password",
            html: `
            <p>Dear User,</p>

            <p>You are receiving this message because a password reset was requested for your account.</p>

            <p>Please use the following <strong style="font-size: 1em;">OTP</strong> to reset your password:</p>

            <strong style="font-size: 1.5em;">${otp}</strong>

            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>

            <p>Thank you,</p>

            <p>Best Book</p>
  `,
            // text: `Dear User,

            // You are receiving this message because a password reset was requested for your account.\n\n

            // Please use the following OTP to reset your password:\n\n

            // ${otp}\n\n

            // If you did not request this, please ignore this email. Your password will remain unchanged.\n\n

            // Thank you,\n\n

            // [Your Company Name]`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({ err: err });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: true,
                status: "OTP sent to email!",
              });
            }
          });
        });
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

//reset password
router.post("/resetpassword", (req, res, next) => {
  User.findOne({
    resetPasswordOTP: req.body.otp,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "OTP is invalid or has expired!" });
      } else {
        user.setPassword(req.body.newPassword, (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          } else {
            user.resetPasswordOTP = undefined; //reset OTP
            user.resetPasswordExpires = undefined; //reset OTP expires
            user
              .save()
              .then(() => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  success: true,
                  status: "Password reset successful!",
                });
              })
              .catch((err) => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

module.exports = router;
