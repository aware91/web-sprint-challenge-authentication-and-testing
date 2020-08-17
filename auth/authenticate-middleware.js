/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const secrets = require("../config/secrets.js");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(400).json({ message: "Missing Authorization Header" });
  } else {
    const [authType, token] = req.headers.authorization.split(" ");

    if(authType && authType.toLowerCase() === "bearer" && token) {
      jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
        if(!err) {
          req.jwt = decodedToken;
          next();
        } else {
          res.status(403).json({ you: 'shall not pass!' });
        }
      });
    } else {
      res.status(401).json({ you: 'shall not pass!' });
    }
  }

  
};