import usersData from '../data/users.js';
import bcrypt from 'bcrypt';

const createUser = async (userData) => {
  const usernameExists = await usersData.getUserByName(userData.username);
  if (usernameExists !== undefined) {
    const massage = {massage: `Username ${usernameExists.username} exist`};
    return massage;
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  const newUser = await usersData.createUser(userData);
  return newUser;
};

const validateUser = async ({username, password}) => {
  const userData = await usersData.getUserByName(username);

  if (userData === undefined) {
    throw new Error('Username does not exist!');
  }

  if (await bcrypt.compare(password, userData.password)) {
    return userData;
  }

  return null;
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
