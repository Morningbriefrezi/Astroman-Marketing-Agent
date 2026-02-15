export function calculateScore(product) {
  const orderWeight = product.orders / 1000;
  const ratingWeight = product.rating * 2;
  const priceAdvantage = product.price < 20 ? 5 : 2;
  return orderWeight + ratingWeight + priceAdvantage;
}