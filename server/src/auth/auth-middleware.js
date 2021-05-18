import passport from 'passport';

const authMiddleware = passport.authenticate('jwt', {session: false});

const roleMiddleware = (roleName) => {
  return (req, res, next) => {
    if (req.user && req.user.is_admin === roleName) {
      next();
    } else {
      res.status(403).send({
        message: 'Resource is forbidden.',
      });
    }
  };
};

export {
  authMiddleware,
  roleMiddleware,
};
