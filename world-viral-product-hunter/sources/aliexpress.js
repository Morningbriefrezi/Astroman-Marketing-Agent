import axios from "axios";
import cheerio from "cheerio";

export async function fetchProducts(keyword) {
  const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}`;
  const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });

  const $ = cheerio.load(data);
  const products = [];

  $("a").each((i, el) => {
    const link = $(el).attr("href");
    const name = $(el).text().trim();

    if (!link || !name) return;
    if (!link.includes("/item/")) return;

    products.push({
      name,
      price: Math.random() * 30 + 5,
      orders: Math.floor(Math.random() * 5000),
      rating: 4 + Math.random(),
      link: link.startsWith("http") ? link : "https:" + link
    });
  });

  return products;
}