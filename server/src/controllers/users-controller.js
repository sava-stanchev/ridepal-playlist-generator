import express from "express";
import asyncHandler from "express-async-handler";
import usersService from "../service/users-service.js";
import usersData from "../data/users.js";
import createUserValidator from "../validators/create-user-validator.js";
import validateBody from "../middlewares/validate-body.js";
import transformBody from "../middlewares/transform-body.js";
import serviceErrors from "../common/service-errors.js";
import { authMiddleware } from "../auth/auth-middleware.js";

const usersController = express.Router();

usersController

  // Register user
  .post(
    "/",
    transformBody(createUserValidator),
    validateBody("user", createUserValidator),
    asyncHandler(async (req, res) => {
      const result = await usersService.createUser(usersData)(req.body);

      if (result.error === serviceErrors.DUPLICATE_RECORD) {
        res.status(409).json({ message: "Username or email already exists!" });
      } else {
        res.status(201).json(result.data);
      }
    })
  )

  // Get all users
  .get("/", authMiddleware, async (req, res) => {
    try {
      const users = await usersService.getAllUsers();
      res.json(users);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  // Update user
  .patch("/:id", authMiddleware, async (req, res) => {
    try {
      const user = req.body;
      await usersService.updateUser(user);
      const updatedUser = await usersService.getUserById(user.id);
      res.status(200).send(updatedUser);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  // Delete user
  .delete("/:id", authMiddleware, async (req, res) => {
    try {
      await usersData.deleteUser(req.params.id);
      res.end();
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  // Change user role
  .put("/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await usersService.getUserById(userId);
      await usersData.changeRole(user);
      const updatedUser = await usersService.getUserById(userId);
      res.status(200).send(updatedUser);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });

export default usersController;
