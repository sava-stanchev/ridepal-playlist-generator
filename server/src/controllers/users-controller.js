import express from 'express';
import userService from '../service/user-service.js';
import usersData from '../data/users.js';

// eslint-disable-next-line new-cap
const usersController = express.Router();

usersController

    .get('/', async (req, res) => {
      try {
        const users = await userService.getAllUsers();
        res.json(users);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    })

    .patch('/:id', async (req, res) => {
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

    .delete('/:id', async (req, res) => {
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

export default usersController;
