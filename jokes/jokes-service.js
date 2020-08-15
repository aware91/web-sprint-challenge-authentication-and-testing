module.exports = {
  isValid,
};

function isValid(joke) {
  return Boolean(joke.username && joke.password && typeof joke.password === "string");
}
