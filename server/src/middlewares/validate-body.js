import errorStrings from '../common/error-strings.js';

export default (resource, validator) => async (req, res, next) => {
  const errors = {};

  Object.keys(validator).forEach((key) => {
    if (!validator[key](req.body[key])) {
      errors[key] = errorStrings[resource][key];
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      errors,
    });
  }

  await next();
};
