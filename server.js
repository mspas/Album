const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const albumRouter = require("./routers/album-routes");
const adminRouter = require("./routers/admin-routes");

const app = express();
const port = process.env.PORT || 5000;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  keepAlive: 1,
};

mongoose.connect(process.env.DB_URI, mongoOptions, () => {
  console.log("Connected to DB");
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

app.use("/api", albumRouter);
app.use("/api/admin", adminRouter);

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

module.exports = app;
