const adminRouter = require("express").Router();
const AuthController = require("../controllers/AuthController");
const ImageController = require("../controllers/ImageController");

adminRouter.post("/login", AuthController.login);
adminRouter.get("/get-all-images", ImageController.getAllImages);
adminRouter.patch("/change-email", AuthController.changeEmail);
adminRouter.patch("/change-password", AuthController.changePassword);
adminRouter.patch("/edit-welcome-article", AuthController.editWelcomeArticle);
adminRouter.post("/upload-images", ImageController.uploadImages);
adminRouter.post("/delete-images", ImageController.deleteImages);
adminRouter.patch("/edit-image", ImageController.editImage);

module.exports = adminRouter;
