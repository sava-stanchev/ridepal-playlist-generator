export default (role) => async (req, res, next) => {
  if (req.user.is_admin !== role) {
    return res.status(403).json({error: `You're not authorized!`});
  }

  await next();
};
