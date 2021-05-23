import usersData from '../data/users.js';
import bcrypt from 'bcrypt';

const createUser = async (userData) => {
  const usernameExist = await usersData.getUserByName(userData.username);
  if (usernameExist[0]) {
    return null;
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  if (typeof userData.user_age === 'undefined') {
    userData.user_age = 'DEFAULT';
  }
  if (typeof userData.gender === 'undefined') {
    userData.gender = 'DEFAULT';
  }
  const newUser = await usersData.createUser(userData);
  return newUser;
};

export default {
  createUser,
};
