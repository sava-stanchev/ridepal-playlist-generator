import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import createToken from './auth/create-token.js';
import userService from './service/user-service.js';
import {authMiddleware} from './auth/auth-middleware.js';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import playlistsData from './data/playlists.js';
import playlistServices from './service/playlistServices.js';
import usersData from './data/users.js';
import dbSeeding from './service/dbSeeding.js';
import pool from './data/pool.js';

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
    const playlist = await playlistServices.playlistGenerator(req);
    res.status(200).send(playlist);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
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
    const playlist = await playlistsData.getTracksForPlaylistById(playlistId);
    const filteredPlaylist = playlist.filter((t) => t.hasOwnProperty('playlist_name'));
    // console.log(filteredPlaylist);
    res.json(filteredPlaylist);
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
});

app.delete('/playlists/:id', async (req, res) => {
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

app.patch('/playlists/:id', async (req, res) => {
  const playlistId = req.params.id;
  const updateData = req.body;
  try {
    const playlist = await playlistsData.getPlaylistById(+playlistId);
    if (!playlist) {
      res.status(404).send({
        message: 'Playlist not found!',
      });
    }

    const playlistUpdated = await playlistServices.updatePlaylist(+playlistId, updateData);
    const newPlaylist = await playlistsData.getPlaylistById(+playlistId);
    if (playlistUpdated) {
      res.status(200).send(newPlaylist[0]);
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.patch('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    const user = await userService.updateUser(userId, data);
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await usersData.getUserById(+req.params.id);
    if (!user || user.is_deleted === 1) {
      return res.status(400).json({
        message: 'User not found!',
      });
    }
    await usersData.deleteUser(+req.params.id);
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/setgenres', async (req, res) => {
  try {
    await dbSeeding.setGenres();
    setTimeout(async () => {
      pool.end();
      res.status(200).send({message: 'Genres are seeded!'});
    }, 5000);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/setmaingenres', async (req, res) => {
  try {
    await dbSeeding.setMainGenres();
    res.status(200).send({message: ' Main genres are set!'});
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/setartistsbygenre', async (req, res) => {
  try {
    const result = await dbSeeding.setArtistsByGenre();
    setTimeout(async () => {
      pool.end();
      res.status(200).send({message: 'Artists seeding is DONE!'});
    }, 5000);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/setalbums', async (req, res) => {
  try {
    const result = await dbSeeding.setAlbums();
    setTimeout(async () => {
      pool.end();
      res.status(200).send({message: 'Albums are seeded!'});
    }, 60000);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/settracks', async (req, res) => {
  try {
    const result = await dbSeeding.setTracks();
    setTimeout(async () => {
      pool.end();
      res.status(200).send({message: 'Tracks are seeded!'});
    }, 80000);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
