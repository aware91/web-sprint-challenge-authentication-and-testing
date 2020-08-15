const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../jokes/jokes-model.js');
const { isValid } = require('../jokes/jokes-service.js');


router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        console.log(error.message)
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if (isValid(req.body)) {
    users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToke(user)
          res.status(200).json({ message: "Welcome to our Dad Jokes", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        console.log(error.message)
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password should be alphanumeric",
    });
  }
});

function generateToke(user) {

  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  };
  const options ={
    expiresIn: '1h'
  };
  const secret = secrets.jwtSecret;
  return jwt.sign(payload, secret, options)
}


module.exports = router;
