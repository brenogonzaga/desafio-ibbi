export const extractDateFromTimestamp = (timestamp: string) => {
  const date = timestamp.split(' ')[0];
  return date.replace(/-/g, '/');
};
