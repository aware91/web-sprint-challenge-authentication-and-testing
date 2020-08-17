module.exports = {
  user: (req, res, next) => {
      const {username, password} = req.body;

      if(!(username && password)) {
          res.status(400).json({ message: "Missing username and/or password" });
      } else {
          next();
      }
  }
}