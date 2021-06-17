import tokensData from '../data/tokens.js';

export default async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');

  if (await tokensData.tokenExists(token)) {
    return res.status(401).json({message: `You're not logged in!`});
  }

  await next();
};
