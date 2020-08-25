const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const mongoClient = new MongoClient(process.env.DB_URI, {
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

const verifyToken = (authHeader) => {
  return new Promise((resolve, reject) => {
    let check = true;
    const authToken = authHeader.split(" ");
    if (authToken[0] !== "Bearer") {
      check = false;
    }
    jwt.verify(authToken[1], process.env.TOKEN_SECRET, (err) => {
      if (err) {
        check = false;
      }
      resolve(check);
    });
  });
};

async function authenticate(req, res, next) {
  const authHeader = req.get("X-Authorization");
  if (!authHeader) {
    return res.status(404).send({
      error: "Token is missing",
    });
  } else {
    let check = await verifyToken(authHeader);
    if (!check) {
      return res.status(404).send({
        error: "Token is invalid",
      });
    }
  }
  next();
}

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

app.patch("/api/change-email", authenticate, async (req, res) => {
  let token = "";
  let password = req.body.password;
  let oldEmail = req.body.oldEmail;
  let newEmail = req.body.newEmail;

  mongoClient
    .db("albumParadyz")
    .collection("users")
    .findOne(
      {
        email: oldEmail,
      },
      (err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          let user = result;
          bcrypt.compare(password, user.hash, async (err, result) => {
            if (!result) {
              res.status(400).send({
                result: {
                  success: false,
                  result: null,
                  errorInfo: "Hasło niepoprawne",
                },
                token: null,
              });
            } else {
              let resultUpdate = await updateEmail(oldEmail, newEmail);
              if (resultUpdate.success)
                token = jwt.sign({ email: newEmail }, process.env.TOKEN_SECRET);
              res.status(200).send({
                result: resultUpdate,
                token: token,
              });
            }
          });
        }
      }
    );
});

app.patch("/api/change-password", authenticate, async (req, res) => {
  let email = req.body.email;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  mongoClient
    .db("albumParadyz")
    .collection("users")
    .findOne(
      {
        email: email,
      },
      (err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          let user = result;
          bcrypt.compare(oldPassword, user.hash, (err, result) => {
            if (!result) {
              res.status(400).send({
                success: false,
                result: null,
                errorInfo: "Hasło niepoprawne",
              });
            } else {
              bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                  res.status(400).send({
                    success: false,
                    result: null,
                    errorInfo: "Błąd kodowania hasła!",
                  });
                } else {
                  let resultUpdate = await updatePassword(email, hash);
                  res.status(200).send({
                    result: resultUpdate,
                  });
                }
              });
            }
          });
        }
      }
    );
});

app.get("/api/get-all-images", (req, res) => {
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

app.post("/api/get-images", async (req, res) => {
  let years = req.body.years;
  let limit = req.body.limit;

  let results = await getImages(years, limit);

  if (results.errorInfo != "") res.status(500).send(results);
  res.send(results);
});

app.get("/api/get-welcome-article", (req, res) => {
  mongoClient
    .db("albumParadyz")
    .collection("articles")
    .findOne({ type: "welcome" }, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(JSON.stringify(result));
      }
    });
});

app.patch("/api/edit-welcome-article", authenticate, (req, res) => {
  let errorInfo = "Tekst zmodyfikowany poprawnie!";
  let objectId = null;

  try {
    objectId = new ObjectId(req.body._id);
  } catch (error) {
    console.log(error);
    res.send({
      result: false,
      errorInfo:
        "Nie znaleziono artykułu! Niepoprawny format identyfikatora ID",
    });
  }

  if (objectId) {
    mongoClient
      .db("albumParadyz")
      .collection("articles")
      .updateOne(
        {
          type: "welcome",
        },
        {
          $set: {
            text: req.body.text,
            sign: req.body.sign,
            origin: req.body.origin,
          },
        },
        (err, result) => {
          if (err) errorInfo = err;
          res.send({ result: true, errorInfo: errorInfo });
        }
      );
  }
});

app.get("/api/get-highlighted-images", (req, res) => {
  mongoClient
    .db("albumParadyz")
    .collection("images")
    .find({ isHighlighted: true })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(JSON.stringify(result));
      }
    });
});

app.post("/api/upload-images", authenticate, async (req, res) => {
  let successCheck = [];

  let i = 0;
  req.body.imagesArray.forEach(async (image) => {
    let result = await uploadImage(image);
    successCheck.push({ image: image, resultData: result });
    if (i === req.body.imagesArray.length - 1) {
      res.send({ resultArray: successCheck });
    }
    i++;
  });
});

app.post("/api/delete-images", authenticate, async (req, res) => {
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

app.patch("/api/edit-image", authenticate, async (req, res) => {
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
          if (err) errorInfo = err;
          res.send({ result: true, errorInfo: errorInfo });
        }
      );
  }
});

app.post("/api/send-email", limiter, (req, res) => {
  let images = req.body.imagesArray;
  let contactMail = req.body.contactMail;
  let senderName = contactMail.split("@")[0];
  let mailText = `Email do kontaktu: ${contactMail}<br> Treść maila: ${req.body.mailText}<br>`;

  let i = 0;
  let attachments = images.map((image) => {
    i++;
    mailText += `<br>Zdjęcie ${i}<br>Opis: ${image.description}<br>Rok: ${image.year}<br>`;
    return {
      filename: `image${i}.jpg`,
      path: image.imageData,
    };
  });

  mongoClient
    .db("albumParadyz")
    .collection("users")
    .find({
      type: "admin",
    })
    .toArray((err, result) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        let i = 0;
        let users = result;
        users.forEach((user) => {
          let mailOptions = {
            from: process.env.MAIL_BOT,
            to: user.email,
            subject: `Zgłoszenie zdjęć do albumu Paradyż od ${senderName}`,
            html: mailText,
            attachments: attachments,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.status(400).send({
                success: false,
                message:
                  "Przepraszamy, zgłoszenie nie zostało wysłane! Prosimy spróbować później.",
              });
            }
            if (i === users.length - 1) {
              let message = "Email wysłany poprawnie!";
              if (attachments.length > 0)
                message =
                  "Zdjęcią wysłane! Zdjęcia pojawią się w albumie po zweryfikowaniu przez administratora. Dziękujemy za wkład w projekt albumu!";
              return res.status(200).send({
                success: true,
                message: message,
              });
            }
            i++;
          });
        });
      }
    });
});

getImages = (years, limit) => {
  return new Promise(async (resolve, reject) => {
    let resultArray = [];
    let resultCount = 0;
    let errorInfo = "";

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      let results = await getImagesForYear(year, limit);

      if (results.errorInfo !== "")
        resolve({
          results: resultArray,
          left: years.slice(i, years.length - 1),
          errorInfo: err,
        });

      resultCount += results.results.length;
      resultArray.push({ year: year, results: results.results });
      if (resultCount >= limit || i > years.length - 2)
        resolve({
          results: resultArray,
          left: years.slice(i + 1, years.length),
          errorInfo: errorInfo,
        });
    }
  });
};

getImagesForYear = (year, limit) => {
  return new Promise((resolve, reject) => {
    let errorInfo = "";
    let db = mongoClient.db("albumParadyz").collection("images");
    db.find({ category: year }).toArray((err, result) => {
      if (err) {
        reject({
          results: result,
          errorInfo: err,
        });
      } else {
        resolve({
          results: result,
          errorInfo: errorInfo,
        });
      }
    });
  });
};

uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image.imageData, (error, result) => {
      if (error) errorInfo = error;

      let year = parseInt(image.year);

      mongoClient
        .db("albumParadyz")
        .collection("images")
        .insertOne(
          {
            public_id: result.public_id,
            url: result.url,
            description: image.description,
            year: year,
            category: Math.floor(year / 10) * 10,
            isHighlighted: image.isHighlighted,
          },
          (err, res) => {
            if (err)
              resolve({
                result: null,
                errorInfo: err,
              });
            else
              resolve({
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

updateEmail = (oldEmail, newEmail) => {
  let errorInfo = "Poprawnie zmieniono email!";

  return new Promise((resolve, reject) => {
    mongoClient
      .db("albumParadyz")
      .collection("users")
      .updateOne(
        {
          email: oldEmail,
        },
        {
          $set: {
            email: newEmail,
          },
        },
        (err, result) => {
          let check = true;
          if (err) {
            errorInfo = err;
            check = false;
          }
          resolve({ success: check, result: result, errorInfo: errorInfo });
        }
      );
  });
};

updatePassword = (email, hash) => {
  let errorInfo = "Poprawnie zmieniono hasło!";

  return new Promise((resolve, reject) => {
    mongoClient
      .db("albumParadyz")
      .collection("users")
      .updateOne(
        {
          email: email,
        },
        {
          $set: {
            hash: hash,
          },
        },
        (err, result) => {
          let check = true;
          if (err) {
            errorInfo = err;
            check = false;
          }
          resolve({ success: check, result: result, errorInfo: errorInfo });
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
