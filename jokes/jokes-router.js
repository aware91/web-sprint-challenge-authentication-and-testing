const axios = require('axios');

const router = require('express').Router();
const checkRole = require('../auth/authenticate-middleware.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, checkRole, (req, res) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
});

module.exports = router;
