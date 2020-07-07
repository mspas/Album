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

app.post("/api/login", async (req, res) => {
  let token = "";
  let password = req.body.password;

  await mongoClient.connect();

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
              res.status(200).send(
                JSON.stringify({
                  token: token,
                })
              );
            }
            if (i > users.length - 2 && !token)
              res.status(400).send("Hasło niepoprawne");
            i++;
          });
        });
      }
    });
});

app.get("/api/create", async (req, res) => {
  await mongoClient.connect();
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
  await mongoClient.connect();
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
  let success = true;
  let errorInfo = "";

  await mongoClient.connect();

  req.body.imagesArray.forEach((image) => {
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
            if (err) {
              errorInfo = err;
              success = false;
            }
            console.log(`1 document inserted id = ${res.insertedId}`);
          }
        );
    });
  });

  if (!success) res.status(400).send(errorInfo);
  res
    .status(200)
    .send(
      `Zdjęcia zostały dodane poprawnie! Ilość dodanych zdjęć: ${req.body.imagesArray.length}`
    );
});

app.post("/api/delete-images", async (req, res) => {
  let successCheck = [];

  await mongoClient.connect();

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
