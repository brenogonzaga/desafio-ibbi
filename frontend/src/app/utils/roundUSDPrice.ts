export const roundUSDPrice = (price: number) => {
  return Math.round(price * 100) / 100;
};
