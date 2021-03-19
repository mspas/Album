const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");
const adminService = require("../services/AdminService");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const Articles = require("../models/Article");
const Users = require("../models/User");

exports.login = [
  async (req, res) => {
    let token = "";
    let password = req.body.password;

    try {
      let result = await Users.find({ type: "admin" }).exec();
      if (result) {
        let i = 0;
        let users = result;
        users.forEach((user) => {
          bcrypt.compare(password, user.hash, (err, result) => {
            if (result) {
              token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET);
              res.status(200).send({
                success: true,
                message: "Zalogowano",
                token: token,
              });
            }
            if (i === users.length - 1 && !token)
              res.status(400).send({
                success: false,
                message: "Hasło niepoprawne",
                token: null,
              });
            i++;
          });
        });
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        result: null,
        errorInfo: err,
      });
    }
  },
];

exports.changeEmail = [
  authenticate,
  async (req, res) => {
    let token = "";
    let password = req.body.password;
    let oldEmail = req.body.oldEmail;
    let newEmail = req.body.newEmail;

    try {
      let result = await Users.findOne({ email: oldEmail });
      if (result) {
        let user = result;
        bcrypt.compare(password, user.hash, async (err, res1) => {
          if (!res1) {
            res.status(400).send({
              result: {
                success: false,
                result: null,
                errorInfo: "Hasło niepoprawne",
              },
              token: null,
            });
          } else {
            let resultUpdate = await adminService.updateEmail(
              oldEmail,
              newEmail
            );
            if (resultUpdate.success)
              token = jwt.sign({ email: newEmail }, process.env.TOKEN_SECRET);
            res.status(200).send({
              result: resultUpdate,
              token: token,
            });
          }
        });
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        result: null,
        errorInfo: "Błąd!",
      });
    }
  },
];

exports.changePassword = [
  authenticate,
  async (req, res) => {
    let email = req.body.email;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    try {
      let result = await Users.findOne({ email: email });
      if (result) {
        let user = result;
        bcrypt.compare(oldPassword, user.hash, (err, res1) => {
          if (!res1) {
            return res.status(400).send({
              success: false,
              result: null,
              errorInfo: "Hasło niepoprawne",
            });
          } else {
            bcrypt.hash(newPassword, 10, async (err, hash) => {
              if (err) {
                return res.status(400).send({
                  success: false,
                  result: null,
                  errorInfo: "Błąd kodowania hasła!",
                });
              } else {
                let resultUpdate = await adminService.updatePassword(
                  email,
                  hash
                );
                return res.status(200).send({
                  result: resultUpdate,
                });
              }
            });
          }
        });
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        result: null,
        errorInfo: "Błąd!",
      });
    }
  },
];

exports.editWelcomeArticle = [
  authenticate,
  async (req, res) => {
    try {
      await Articles.updateOne(
        { type: "welcome" },
        {
          $set: {
            text: req.body.text,
            sign: req.body.sign,
            origin: req.body.origin,
          },
        }
      );
      res.send({ result: true, errorInfo: "Tekst zmodyfikowany poprawnie" });
    } catch (error) {
      res.status(400).send({
        result: true,
        errorInfo: error,
      });
    }
  },
];
