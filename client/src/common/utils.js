export const convertHMS = (value) => {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (seconds >= 30) minutes++;
  if (minutes < 10) minutes = "0" + minutes;
  if (hours < 1) {
    return minutes + "min.";
  }
  return hours + "h " + minutes + "min.";
};

export const trackTimeFormat = (s) => {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
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
