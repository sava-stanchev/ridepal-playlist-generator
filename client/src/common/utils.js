export const convertHMS = (value) => {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (seconds >= 30) minutes++;
  if (minutes < 10) minutes = '0' + minutes;
  return hours + 'h ' + minutes + 'm';
}
