import usersData from '../data/users.js';
import bcrypt from 'bcrypt';

const createUser = async (userData) => {
  const usernameExists = await usersData.getUserByName(userData.username);
  if (usernameExists[0]) {
    return null;
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  const newUser = await usersData.createUser(userData);
  return newUser;
};

export default {
  createUser,
};
