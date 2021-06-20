import usersData from '../data/users.js';
import bcrypt from 'bcrypt';
import serviceErrors from '../common/service-errors.js';

const createUser = (usersData) => async (user) => {
  const {username, email, password} = user;

  const usernameExists = await usersData.getUserBy('username', username);
  const emailExists = await usersData.getUserBy('email', email);

  if (usernameExists || emailExists) {
    return {
      error: serviceErrors.DUPLICATE_RECORD,
      data: null,
    };
  }

  const cryptedPassword = await bcrypt.hash(password, 10);

  return {
    error: null,
    data: await usersData.createUser({
      ...user,
      password: cryptedPassword,
    }),
  };
};

const validateUser = (usersData) => async (username, password) => {
  const user = await usersData.getUserBy('username', username);

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
