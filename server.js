const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

const db_uri = process.env.DB_URI;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const mongoClient = new MongoClient(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("trust proxy", 1);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const minutesTimeout = 2;
const limiter = rateLimit({
  windowMs: minutesTimeout * 60 * 1000,
  max: 1, // limit when timeout fires
  handler: (req, res) => {
    res.status(429).send({
      statusCode: "429",
      message: `Przepraszamy! Filtr antyspamowy wymaga ${minutesTimeout} minutowej przerwy między kolejnymi zgłoszeniami!`,
    });
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_BOT,
    pass: process.env.MAIL_BOT_PASS,
  },
});

mongoClient.connect();

app.post("/api/login", async (req, res) => {
  let token = "";
  let password = req.body.password;

  mongoClient
    .db("albumParadyz")
    .collection("users")
    .find({
      type: "admin",
    })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        let i = 0;
        let users = result;
        users.forEach((user) => {
          bcrypt.compare(password, user.hash, (err, result) => {
            if (result) {
              token = jwt.sign(user.email, process.env.TOKEN_SECRET);
              res.status(200).send({
                success: true,
                message: "Zalogowano",
                token: token,
              });
            }
            if (i === users.length - 1 && !token)
              res.status(400).send({
                success: true,
                message: "Hasło niepoprawne",
                token: null,
              });
            i++;
          });
        });
      }
    });
});

app.get("/api/create", async (req, res) => {
  bcrypt.hash("albumParadyz", 10, (err, hash) => {
    mongoClient
      .db("albumParadyz")
      .collection("users")
      .insertOne(
        {
          email: "marcin7789@gmail.com",
          hash: hash,
          type: "admin",
        },
        (err, res) => {
          if (err) errorInfo = err;
          console.log(`1 document inserted id = ${res.insertedId}`);
        }
      );
  });
});

app.get("/api/get-all-images", async (req, res) => {
  mongoClient
    .db("albumParadyz")
    .collection("images")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(JSON.stringify(result));
      }
    });
});

app.post("/api/upload-images", async (req, res) => {
  let successCheck = [];

  let i = 0;
  req.body.imagesArray.forEach(async (image) => {
    let result = await uploadImage(image);
    successCheck.push(result);
    if (i === req.body.imagesArray.length - 1) {
      res.send({ result: successCheck });
    }
    i++;
  });
});

app.post("/api/delete-images", async (req, res) => {
  let successCheck = [];

  let i = 0;
  req.body.imagesArray.forEach(async (imageId) => {
    let objectId = "";
    let result = {
      id: imageId,
      success: false,
      errorInfo: "Nie znaleziono zdjęcia! Niepoprawny format identyfikatora ID",
    };
    try {
      objectId = new ObjectId(imageId);
      result = await deleteImage(objectId);
    } catch (error) {
      console.log(error);
    }
    successCheck.push(result);
    if (i === req.body.imagesArray.length - 1) {
      res.send({ result: successCheck });
    }
    i++;
  });
});

app.patch("/api/edit-image", async (req, res) => {
  let successCheck = true;
  let errorInfo = "Zdjęcie zmodyfikowane poprawnie!";
  let objectId = null;

  try {
    objectId = new ObjectId(req.body.image._id);
  } catch (error) {
    console.log(error);
    res.send({
      result: false,
      errorInfo: "Nie znaleziono zdjęcia! Niepoprawny format identyfikatora ID",
    });
  }

  if (objectId) {
    mongoClient
      .db("albumParadyz")
      .collection("images")
      .updateOne(
        {
          public_id: req.body.image.public_id,
        },
        {
          $set: {
            description: req.body.image.description,
            year: req.body.image.year,
            isHighlighted: req.body.image.isHighlighted,
          },
        },
        (err, result) => {
          if (err) {
            errorInfo = err;
            successCheck = false;
          }
          res.send({ result: true, errorInfo: errorInfo });
        }
      );
  }
});

app.post("/api/send-email", limiter, (req, res) => {
  let mailSubject = req.body.mailSubject;
  let mailText = req.body.mailText;

  mongoClient
    .db("albumParadyz")
    .collection("users")
    .find({
      type: "admin",
    })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        let i = 0;
        let users = result;
        users.forEach((user) => {
          let mailOptions = {
            from: process.env.MAIL_BOT,
            to: user.email,
            subject: mailSubject,
            text: mailText,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              res.status(400).send({
                success: false,
                message:
                  "Przepraszamy, zgłoszenie nie zostało wysłane! Prosimy spróbować później.",
              });
            }
            if (i === users.length - 1)
              res.status(200).send({
                success: true,
                message:
                  "Zdjęcią wysłane! Dziękujemy za wkład. Zdjęcia pojawią się w albumie po zweryfikowaniu przez administratora.",
              });
            i++;
          });
        });
      }
    });
});

uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image.imageData, (error, result) => {
      if (error) errorInfo = error;

      mongoClient
        .db("albumParadyz")
        .collection("images")
        .insertOne(
          {
            public_id: result.public_id,
            url: result.url,
            description: image.description,
            year: image.year,
            isHighlighted: image.isHighlighted,
          },
          (err, res) => {
            if (err)
              resolve({
                imageDescription: image.description,
                result: null,
                errorInfo: err,
              });
            else
              resolve({
                imageDescription: image.description,
                result: result,
                errorInfo: "",
              });
          }
        );
    });
  });
};

deleteImage = (objectId) => {
  return new Promise((resolve, reject) => {
    mongoClient
      .db("albumParadyz")
      .collection("images")
      .findOne(
        {
          _id: objectId,
        },
        (err, result) => {
          if (err) {
            resolve({ id: objectId, success: false, errorInfo: err });
          }
          if (!result) {
            errorInfo = err;
            resolve({
              id: objectId,
              success: false,
              errorInfo: "Nie znaleziono zdjęcia!",
            });
          } else {
            cloudinary.uploader.destroy(result.public_id);

            mongoClient
              .db("albumParadyz")
              .collection("images")
              .deleteOne(
                {
                  _id: objectId,
                },
                (err, res) => {
                  if (err) {
                    resolve({ id: objectId, success: false, errorInfo: err });
                  }
                }
              );
          }
          resolve({ id: objectId, success: true, errorInfo: "" });
        }
      );
  });
};

process.on("SIGINT", () => {
  mongoClient.close();
  console.log("Mongoose disconnected on app termination");
  process.exit(0);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
