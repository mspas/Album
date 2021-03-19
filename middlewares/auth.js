const jwt = require("jsonwebtoken");

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

module.exports = authenticate;
