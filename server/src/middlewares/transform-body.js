export default (validator) => async (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (!validator[key]) {
      delete req.body[key];
    }
  });

  await next();
};
