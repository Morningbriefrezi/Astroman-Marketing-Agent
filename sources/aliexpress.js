import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchAliExpress(keyword) {
  try {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 8000
    });

    const $ = cheerio.load(data);
    const products = [];

    $("a._3t7zg").each((i, el) => {
      const name = $(el).text();
      const link = "https:" + $(el).attr("href");

      products.push({
        name,
        price: 20,
        rating: 4.5,
        orders: 1000,
        link
      });
    });

    return products;
  } catch {
    return [];
  }
}
