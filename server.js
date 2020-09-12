const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Images = require("./models/Image");
const Articles = require("./models/Article");
const Users = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  keepAlive: 1,
};

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

app.set("trust proxy", 1);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

mongoose.connect(process.env.DB_URI, mongoOptions, () => {
  console.log("Connected to DB");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_BOT,
    pass: process.env.MAIL_BOT_PASS,
  },
});

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
});

app.get("/api/create", async (req, res) => {
  bcrypt.hash("albumParadyz", 10, async (err, hash) => {
    const newUser = new Users({
      email: "spasinska223@gmail.com",
      hash: hash,
      type: "admin",
    });

    try {
      await newUser.save();
      console.log(`1 document inserted id = ${res.insertedId}`);
    } catch (err) {
      console.log(err);
    }
  });
});

app.patch("/api/change-email", authenticate, async (req, res) => {
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
  } catch (err) {
    res.status(400).send({
      success: false,
      result: null,
      errorInfo: "Błąd!",
    });
  }
});

app.patch("/api/change-password", authenticate, async (req, res) => {
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
              let resultUpdate = await updatePassword(email, hash);
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
});

app.get("/api/get-all-images", async (req, res) => {
  try {
    let result = await Images.find();
    res.send(JSON.stringify(result));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/api/get-images", async (req, res) => {
  let years = req.body.years;
  let limit = req.body.limit;

  let results = await getImages(years, limit);

  if (results.errorInfo != "") res.status(500).send(results);
  res.send(results);
});

app.get("/api/get-welcome-article", async (req, res) => {
  try {
    let result = await Articles.findOne({ type: "welcome" });
    res.send(JSON.stringify(result));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/createw", async (req, res) => {
  const newUser = new Articles({
    type: "welcome",
    text: "Lorem ipsum",
    sign: "admin",
    origin: "admin",
  });

  try {
    await newUser.save();
    console.log(`1 document inserted id = ${res.insertedId}`);
  } catch (err) {
    console.log(err);
  }
});

app.patch("/api/edit-welcome-article", authenticate, async (req, res) => {
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
});

app.get("/api/get-highlighted-images", async (req, res) => {
  try {
    let result = await Images.find({ isHighlighted: true }).exec();
    res.send(JSON.stringify(result));
  } catch (err) {
    res.status(400).send(err);
  }
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
    let result = {
      id: imageId,
      success: false,
      errorInfo: "Nie znaleziono zdjęcia! Niepoprawny format identyfikatora ID",
    };
    result = await deleteImage(imageId);
    successCheck.push(result);
    if (i === req.body.imagesArray.length - 1) {
      res.send({ result: successCheck });
    }
    i++;
  });
});

app.patch("/api/edit-image", authenticate, async (req, res) => {
  try {
    const updated = await Images.updateOne(
      { public_id: req.body.image.public_id },
      {
        $set: {
          description: req.body.image.description,
          year: req.body.image.year,
          isHighlighted: req.body.image.isHighlighted,
        },
      }
    );
    res.send({
      result: updated,
      success: true,
      errorInfo: "Zdjęcie zmodyfikowane poprawnie!",
    });
  } catch (error) {
    res.status(400).send({
      result: null,
      success: false,
      errorInfo: error,
    });
  }
});

app.post("/api/send-email", limiter, async (req, res) => {
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

  try {
    let users = await Users.find({ type: "admin" }).exec();

    let i = 0;

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
  } catch (err) {
    res.status(400).send({
      result: null,
      errorInfo: err,
    });
  }
});

getImages = (years, limit) => {
  return new Promise(async (resolve, reject) => {
    let resultArray = [];
    let resultCount = 0;
    let errorInfo = "";

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      let results = await getImagesForYear(year, limit);
      if (results.errorInfo.length > 0)
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
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Images.find({ category: year }).exec();
      resolve({
        results: result,
        errorInfo: "",
      });
    } catch (err) {
      resolve({
        results: null,
        errorInfo: err,
      });
    }
  });
};

uploadImage = (image) => {
  return new Promise(async (resolve, reject) => {
    cloudinary.uploader.upload(image.imageData, async (error, result) => {
      if (error) {
        resolve({
          result: null,
          errorInfo: error,
        });
      }

      let year = parseInt(image.year);

      const newImage = new Images({
        public_id: result.public_id,
        url: result.url,
        description: image.description,
        year: year,
        category: Math.floor(year / 10) * 10,
        isHighlighted: image.isHighlighted,
      });

      try {
        await newImage.save();
        resolve({
          result: result,
          errorInfo: "",
        });
      } catch (err) {
        resolve({
          result: null,
          errorInfo: err,
        });
      }
    });
  });
};

deleteImage = (imageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageToRemove = await Images.findOne({ _id: imageId });
      const removed = await Images.deleteOne({ _id: imageId });
      if (removed) await cloudinary.uploader.destroy(imageToRemove.public_id);
      resolve({ id: imageId, success: true, errorInfo: "" });
    } catch (error) {
      console.log(error);
      resolve({
        id: imageId,
        success: false,
        errorInfo: "Nie znaleziono zdjęcia!",
      });
    }
  });
};

updateEmail = (oldEmail, newEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await Users.updateOne(
        { email: oldEmail },
        { $set: { email: newEmail } }
      );
      resolve({
        result: updated,
        success: true,
        errorInfo: "Poprawnie zmieniono email!",
      });
    } catch (error) {
      resolve({
        result: null,
        success: false,
        errorInfo: error,
      });
    }
  });
};

updatePassword = (email, hash) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await Users.updateOne(
        { email: email },
        { $set: { hash: hash } }
      );
      resolve({
        result: email,
        success: true,
        errorInfo: "Poprawnie zmieniono hasło!",
      });
    } catch (error) {
      resolve({
        result: null,
        success: false,
        errorInfo: error,
      });
    }
  });
};

process.on("SIGINT", () => {
  mongoose.connection.close();
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
