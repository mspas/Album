const authenticate = require("../middlewares/auth");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const cloudinary = require("cloudinary").v2;
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const Images = require("../models/Image");
const Articles = require("../models/Article");
const Users = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_BOT,
    pass: process.env.MAIL_BOT_PASS,
  },
});

const minutesTimeout = 2;
const limiter = rateLimit({
  windowMs: minutesTimeout * 60 * 1000,
  max: 5, // limit when timeout fires
  handler: (req, res) => {
    res.status(429).send({
      statusCode: "429",
      message: `Przepraszamy! Filtr antyspamowy wymaga ${minutesTimeout} minutowej przerwy między kolejnymi zgłoszeniami!`,
    });
  },
});

exports.getAllImages = [
  async (req, res) => {
    try {
      let result = await Images.find();
      res.send(JSON.stringify(result));
    } catch (err) {
      res.status(400).send(err);
    }
  },
];

exports.getImages = [
  async (req, res) => {
    let years = req.body.years;
    let limit = req.body.limit;

    let results = await getImages(years, limit);

    if (results.errorInfo != "") res.status(500).send(results);
    res.send(results);
  },
];

exports.getWelcomeArticle = [
  async (req, res) => {
    try {
      let result = await Articles.findOne({ type: "welcome" });
      res.send(JSON.stringify(result));
    } catch (err) {
      res.status(400).send(err);
    }
  },
];

exports.getHighlightedImages = [
  async (req, res) => {
    try {
      let result = await Images.find({ isHighlighted: true }).exec();
      res.send(JSON.stringify(result));
    } catch (err) {
      res.status(400).send(err);
    }
  },
];

exports.sendEmail = [
  limiter,
  async (req, res) => {
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
  },
];

exports.uploadImages = [
  authenticate,
  async (req, res) => {
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
  },
];

exports.deleteImages = [
  authenticate,
  async (req, res) => {
    let successCheck = [];

    let i = 0;
    req.body.imagesArray.forEach(async (imageId) => {
      let result = {
        id: imageId,
        success: false,
        errorInfo:
          "Nie znaleziono zdjęcia! Niepoprawny format identyfikatora ID",
      };
      result = await deleteImage(imageId);
      successCheck.push(result);
      if (i === req.body.imagesArray.length - 1) {
        res.send({ result: successCheck });
      }
      i++;
    });
  },
];

exports.editImage = [
  authenticate,
  async (req, res) => {
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
  },
];

const getImages = (years, limit) => {
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

const getImagesForYear = (year, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Images.find({ category: year }).exec();
      if (result.length > 1)
        result.sort((a, b) => {
          return a.year > b.year;
        });
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

const uploadImage = (image) => {
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
        url: result.secure_url,
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

const deleteImage = (imageId) => {
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

const updateEmail = (oldEmail, newEmail) => {
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

const updatePassword = (email, hash) => {
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
