import express from 'express';
import asyncHandler from 'express-async-handler';
import usersService from '../service/users-service.js';
import tokensData from '../data/tokens.js';
import usersData from '../data/users.js';
import serviceErrors from '../common/service-errors.js';
import createToken from '../auth/create-token.js';

const authController = express.Router();

authController

    .post('/login', asyncHandler(async (req, res) => {
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
    }))

    .delete('/logout', asyncHandler(async (req, res) => {
      await tokensData.blacklistToken(req.headers.authorization.replace('bearer ', ''));

      res.json({message: 'Successfully logged out!'});
    }));

export default authController;
