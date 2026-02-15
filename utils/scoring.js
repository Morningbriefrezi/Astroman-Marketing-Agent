export function scoreProducts(products, trends) {
  return products
    .map(p => {
      let trendBoost = trends.some(t =>
        p.name.toLowerCase().includes(t.replace("#", ""))
      )
        ? 20
        : 0;

      const score =
        Math.log(p.orders + 1) * 2 +
        p.rating * 10 +
        trendBoost;

      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score);
}
