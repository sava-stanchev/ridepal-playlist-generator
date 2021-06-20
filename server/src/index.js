import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import usersService from './service/users-service.js';
import {authMiddleware} from './auth/auth-middleware.js';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import playlistServices from './service/playlist-services.js';
import playlistsController from './controllers/playlists-controller.js';
import usersController from './controllers/users-controller.js';
import tokensData from './data/tokens.js';
import createUserValidator from './validators/create-user-validator.js';
import validateBody from './middlewares/validate-body.js';
import usersData from './data/users.js';
import serviceErrors from './common/service-errors.js';
import createToken from './auth/create-token.js';

const config = dotenv.config().parsed;
const PORT = config.PORT;

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

passport.use(jwtStrategy);
app.use(passport.initialize());

app.use('/playlists', playlistsController);
app.use('/users', usersController);

/** Register */
app.post('/register', validateBody('user', createUserValidator), asyncHandler(async (req, res) => {
  const result = await usersService.createUser(usersData)(req.body);
  console.log(result);
  if (result.error === serviceErrors.DUPLICATE_RECORD) {
    res.status(409).json({message: 'Username or email already exists!'});
  } else {
    res.status(201).json(result.data);
  }
}));

/** Login */
app.post('/login', asyncHandler(async (req, res) => {
  const {username, password} = req.body;
  const result = await usersService.validateUser(usersData)(username, password);

  if (result.error === serviceErrors.OPERATION_NOT_PERMITTED) {
    return res.status(401).json({message: 'Invalid credentials!'});
  }

  if (result.error === serviceErrors.RECORD_NOT_FOUND) {
    return res.status(400).json({message: 'User has been deleted!'});
  }

  const user = result.data;

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role_id,
  };

  const token = createToken(payload);
  res.status(200).json({token});
}));

/** Logout */
app.delete('/logout', asyncHandler(async (req, res) => {
  await tokensData.blacklistToken(req.headers.authorization.replace('bearer ', ''));

  res.json({message: 'Successfully logged out!'});
}));

app.post('/playlist', authMiddleware, async (req, res) => {
  try {
    const playlist = await playlistServices.playlistGenerator(req);
    res.status(200).send(playlist);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.all('*', (req, res) => {
  res.status(404).json({message: 'Resource not found.'});
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
