import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import createToken from './auth/create-token.js';
import userService from './service/user-service.js';
import {authMiddleware} from './auth/auth-middleware.js';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import playlistServices from './service/playlist-services.js';
import playlistsController from './controllers/playlists-controller.js';
import usersController from './controllers/users-controller.js';

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
app.post('/register', async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await userService.createUser(userData);
    if (!newUser) {
      return res.status(400).json({message: 'Username exist!'});
    }
    return res.status(200).send(newUser);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

/** Login */
app.post('/login', async (req, res) => {
  try {
    const user = await userService.validateUser(req.body);
    if (user) {
      const token = createToken({
        id: user.id,
        username: user.username,
        role: user.role_id,
      });
      res.json({
        token,
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials!',
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

/** Logout */
app.delete('/logout', authMiddleware, async (req, res) => {
  try {
    await userService.logout(req.headers.authorization.replace('Bearer ', ''));

    res.json({
      message: 'Successfully logged out!',
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

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

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
