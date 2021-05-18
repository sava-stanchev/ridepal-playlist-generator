import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import createToken from './auth/create-token.js';
import usersData from './data/users.js';
import {authMiddleware} from './auth/auth-middleware.js';
import passport from 'passport';
import jwtStrategy from './auth/strategy.js';
import userService from './services/user-service.js';

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

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
