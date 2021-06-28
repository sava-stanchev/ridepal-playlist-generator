import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import playlistsController from './controllers/playlists-controller.js';
import usersController from './controllers/users-controller.js';
import authController from './controllers/auth-controller.js';

const config = dotenv.config().parsed;
const PORT = config.PORT;

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.set('trust proxy', 1);

passport.use(jwtStrategy);
app.use(passport.initialize());

app.use('/', authController);
app.use('/playlists', playlistsController);
app.use('/users', usersController);

app.all('*', (req, res) => {
  res.status(404).json({message: 'Resource not found!'});
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
