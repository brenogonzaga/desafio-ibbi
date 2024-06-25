export const extractTimeFromTimestamp = (timestamp: string) => {
  const time = timestamp.split(' ')[1];
  return time.slice(0, 5);
};
