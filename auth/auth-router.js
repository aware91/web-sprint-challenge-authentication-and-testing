const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret.js');

const Jokes = require('../jokes/jokes-model.js');
const { isValid } = require('../jokes/jokes-service.js');


router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    Jokes.add(credentials)
      .then(joke => {
        res.status(201).json({ data: joke });
      })
      .catch(error => {
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
    Jokes.findBy({ username: username })
      .then(([joke]) => {
        if (joke && bcryptjs.compareSync(password, joke.password)) {
          const token = generateToke(joke)
          res.status(200).json({ message: "Welcome to our Dad Jokes", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password should be alphanumeric",
    });
  }
});

function generateToke(joke) {

  const payload = {
    subject: joke.id,
    username: joke.username,
    role: joke.role
  };
  const options ={
    expiresIn: '1h'
  };
  const secret = secrets.jwtSecret;
  return jwt.sign(payload, secret, options)
}


module.exports = router;
