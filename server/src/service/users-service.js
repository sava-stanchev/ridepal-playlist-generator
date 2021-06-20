import usersData from '../data/users.js';
import bcrypt from 'bcrypt';
import serviceErrors from '../common/service-errors.js';

const createUser = async (userData) => {
  const usernameExists = await usersData.getUserByName(userData.username);
  if (usernameExists !== undefined) {
    const message = {message: `Username ${usernameExists.username} already exists!`};
    return message;
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  const newUser = await usersData.createUser(userData);
  return newUser;
};

const validateUser = (usersData) => async (username, password) => {
  const user = await usersData.getUserByName(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error: serviceErrors.OPERATION_NOT_PERMITTED,
      data: null,
    };
  }

  if (user.is_deleted) {
    return {
      error: serviceErrors.RECORD_NOT_FOUND,
      data: null,
    };
  }

  return {
    error: null,
    data: user,
  };
};

const getAllUsers = async () => {
  const users = await usersData.getAllUsers();
  return users;
};

const updateUser = async (id, data) => {
  const updatedUser = await usersData.updateUser(id, data);
  return updatedUser;
};

const getUserById = async (id) => {
  const user = await usersData.getUserById(id);
  return user;
};

export default {
  createUser,
  validateUser,
  getAllUsers,
  getUserById,
  updateUser,
};
