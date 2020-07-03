const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const MongoClient = require("mongodb").MongoClient;
const cloudinary = require("cloudinary").v2;

const app = express();
const port = process.env.PORT || 5000;
const db_uri =
  "mongodb+srv://MongoDbAdmin:brakoadmin@cluster0.lz0ei.azure.mongodb.net/albumParadyz?retryWrites=true&w=majority";
cloudinary.config({
  cloud_name: "mspas",
  api_key: "427459526345436",
  api_secret: "UyBgooJb0ldnf3XwAPYIfeStElA",
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

app.get("/api/get-all-images", async (req, res) => {
  await mongoClient.connect();
  const result = mongoClient
    .db("albumParadyz")
    .collection("images")
    .insertOne(
      {
        url: "https://i.imgur.com/DuZ4uiQ.jpg?fb",
        description: "Wide hardo",
      },
      (err, res) => {
        if (err) throw err;
        console.log("1 document inserted", res.insertedId);
      }
    );
  console.log(result);
  res.send();
});

app.post("/api/upload-images", (req, res) => {
  let image = req.body.imagesArray[0];
  cloudinary.uploader.upload(image, async (error, result) => {
    console.log(result, error);
    if (error) res.status(400).send(error);

    await mongoClient.connect();
    const resultMongo = mongoClient
      .db("albumParadyz")
      .collection("images")
      .insertOne(
        {
          url: result.url,
          description: "Test description",
        },
        (err, resM) => {
          if (err) {
            res.status(400).send(err);
            throw err;
          }
          console.log("1 document inserted");
          res.send(resM.insertedId);
        }
      );
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
