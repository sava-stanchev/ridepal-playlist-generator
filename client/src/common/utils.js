export const convertHMS = (value) => {
  const sec = parseInt(value, 10);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const adjustedMinutes = seconds >= 30 ? minutes + 1 : minutes;
  const formattedMinutes = String(adjustedMinutes).padStart(2, "0");

  if (hours === 0) {
    return `${formattedMinutes}min.`;
  }

  return `${hours}h ${formattedMinutes}min.`;
};

export const trackTimeFormat = (s) => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const joinClasses = (classesArr) => {
  return classesArr.filter(Boolean).join(" ");
};

export const isValidEmail = (email) => {
  const isEmailValid =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    );
  return isEmailValid;
};

export const isValidPassword = (password) => {
  const isPasswordValid =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/.test(password);
  return isPasswordValid;
};
