const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send();
  }
};

const createHashToken = async () => {
  const token = uuidv4.uuid();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(token, salt);
  return { hash, token };
};

module.exports = {
  ensureAuthenticated,
  createHashToken,
};
