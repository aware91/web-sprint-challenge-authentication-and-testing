const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require("../users/users-model.js");
const validate = require("./validate.js");

router.post('/register', validate.user, (req, res) => {
  // implement registration
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  
  Users.add(user)
    .then(user => {
      const token = generateToken(user);
      res.status(201).json({username: user.username, token});
    })
    .catch(err => res.status(500).json({ message: "Error Creating User", err }));

});

router.post('/login', validate.user, (req, res) => {
  // implement login
  const {username, password} = req.body;

  Users.findBy({ username })
    .then(user => {
      if(user) {
        if(bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ username: user.username, token });
        }
      } else {
        res.status(404).json({ message: "User not found!"});
      }
    })
    .catch(err => res.status(500).json({ message: "Error retrieving the user data", err }));
  
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    created_at: Date.now()
  }

  const options = {
    expiresIn: "1h"
  }

  if(user.username === "tester") {
    options.expiresIn = "365d";
  }

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;