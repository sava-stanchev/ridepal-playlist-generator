export default {
  username: (value) => typeof value === 'string' && value.length >= 3 && value.length <= 15,
  password: (value) => typeof value === 'string' && value.length >= 4 && value.length <= 30,
  email: (value) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value),
};
