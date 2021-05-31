import {tokenExists} from '../data/tokens.js';

export default async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');

  if (await tokenExists(token)) {
    return res.status(401).json({error: `You're not logged in!`});
  }

  await next();
};
