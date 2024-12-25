import tokensData from "../data/tokens.js";

export default async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const result = await tokensData.getToken(token);

  if (!result) {
    return res.status(401).json({ message: `You're not signed in!` });
  }

  await next();
};
