import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchAmazon(keyword) {
  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 8000
    });

    const $ = cheerio.load(data);
    const products = [];

    $(".s-result-item").each((i, el) => {
      const name = $(el).find("h2 span").text();
      const price = parseFloat($(el).find(".a-price-whole").first().text().replace(",", ""));
      const rating = parseFloat($(el).find(".a-icon-alt").text());
      const reviewsText = $(el).find(".a-size-base").text().replace(",", "");
      const reviews = parseInt(reviewsText) || 0;
      const link = "https://www.amazon.com" + $(el).find("h2 a").attr("href");

      if (name && price && rating && reviews && link) {
        products.push({
          name,
          price,
          rating,
          orders: reviews,
          link
        });
      }
    });

    return products;
  } catch {
    return [];
  }
}
