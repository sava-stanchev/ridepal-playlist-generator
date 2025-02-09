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
        return res
          .status(409)
          .json({ message: "Username or email already exists!" });
      }

      res.status(201).json(result.data);
    })
  )

  // Get all users
  .get(
    "/",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const users = await usersService.getAllUsers();
      res.json(users);
    })
  )

  // Update user
  .patch(
    "/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      await usersService.updateUser(updatedData);
      const updatedUser = await usersService.getUserById(id);

      res.status(200).json(updatedUser);
    })
  )

  // Delete user
  .delete(
    "/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await usersData.deleteUser(id);
      res.status(204).end();
    })
  )

  // Change user role
  .put(
    "/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      const user = await usersService.getUserById(id);
      await usersData.changeRole(user);
      const updatedUser = await usersService.getUserById(id);

      res.status(200).json(updatedUser);
    })
  );

export default usersController;
