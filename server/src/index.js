import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import createToken from './auth/create-token.js';
import userService from './service/user-service.js';
import {authMiddleware} from './auth/auth-middleware.js';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import playlistService from './service/playlist-service.js';
import playlistsData from './data/playlists.js';
import {playlistGenerator} from './service/playlistServices.js';

const config = dotenv.config().parsed;
const PORT = config.PORT;

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

passport.use(jwtStrategy);
app.use(passport.initialize());

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
        users_id: user.users_id,
        username: user.username,
        user_role: user.user_role,
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
    const playlist = await playlistGenerator(req);
  } catch (error) {

  }
});

app.get('/playlists', async (req, res) => {
  try {
    const thePlaylists = await playlistsData.getAllPlaylists();
    res.json(thePlaylists);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/playlists/:id', async (req, res) => {
  try {
    const playlistId = +req.params.id;
    const playlist = await playlistsData.getPlaylistById(playlistId);
    const filteredPlaylist = playlist.filter((t) => t.hasOwnProperty('playlist_name'));
    console.log(filteredPlaylist);
    res.json(filteredPlaylist);
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
});

app.delete('/playlists/:id', async (req, res) => {
  console.log(+req.params.id);
  try {
    const playlist = await playlistsData.getPlaylistById(+req.params.id);
    if (!playlist || playlist.is_deleted === 1) {
      return res.status(400).json({
        message: 'Playlist not found!',
      });
    }
    await playlistsData.deletePlaylist(+req.params.id);
    res.status(200).send(playlist);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
