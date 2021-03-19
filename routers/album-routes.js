const albumRouter = require("express").Router();
const ImageController = require("../controllers/ImageController");

albumRouter.get("/login", ImageController.getAllImages);
albumRouter.post("/get-images", ImageController.getImages);
albumRouter.get("/get-welcome-article", ImageController.getWelcomeArticle);
albumRouter.get(
  "/get-highlighted-images",
  ImageController.getHighlightedImages
);
albumRouter.post("/send-email", ImageController.sendEmail);

module.exports = albumRouter;
