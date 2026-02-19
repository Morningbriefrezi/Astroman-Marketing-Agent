import axios from "axios";
import * as cheerio from "cheerio";

// Scrape trending/popular products from Mymarket.ge
async function scrapeMymarket() {
  const { data } = await axios.get("https://www.mymarket.ge/ka/search/?text=&categoryId=6&sortId=4", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    timeout: 10000
  });

  const $ = cheerio.load(data);
  const products = [];

  // Mymarket product cards
  $(".we-card-container, .item-box, [class*='product'], [class*='listing']").each((i, el) => {
    if (i >= 10) return false;
    const title = $(el).find("h2, h3, .title, [class*='title'], [class*='name']").first().text().trim();
    const price = $(el).find(".price, [class*='price']").first().text().trim();
    if (title && title.length > 5) {
      products.push({ title, price: price || "ფასი მიუთითებელია" });
    }
  });

  return products;
}

// Scrape Extra.ge popular items
async function scrapeExtra() {
  const { data } = await axios.get("https://extra.ge/ka/catalog?sort=popularity", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    timeout: 10000
  });

  const $ = cheerio.load(data);
  const products = [];

  $(".product-item, .catalog-item, [class*='product-card'], [class*='item-card']").each((i, el) => {
    if (i >= 10) return false;
    const title = $(el).find("h2, h3, .name, .title, [class*='title']").first().text().trim();
    const price = $(el).find(".price, [class*='price']").first().text().trim();
    if (title && title.length > 5) {
      products.push({ title, price: price || "ფასი მიუთითებელია" });
    }
  });

  return products;
}

export async function scrapeGeorgianViral() {
  const results = [];
  const errors = [];

  // Try Mymarket
  try {
    const mymarketProducts = await scrapeMymarket();
    if (mymarketProducts.length > 0) {
      results.push({ source: "Mymarket.ge", products: mymarketProducts });
    }
  } catch (err) {
    errors.push(`Mymarket.ge: ${err.message}`);
  }

  // Try Extra
  try {
    const extraProducts = await scrapeExtra();
    if (extraProducts.length > 0) {
      results.push({ source: "Extra.ge", products: extraProducts });
    }
  } catch (err) {
    errors.push(`Extra.ge: ${err.message}`);
  }

  if (results.length === 0) {
    return `❌ სქრეპინგი ვერ განხორციელდა\n\nშეცდომები:\n${errors.join("\n")}`;
  }

  let message = "🔥 *ტოპ პროდუქტები ქართული შოპებიდან:*\n";

  for (const { source, products } of results) {
    message += `\n*📦 ${source}:*\n`;
    products.slice(0, 8).forEach((p, i) => {
      message += `${i + 1}. ${p.title}`;
      if (p.price) message += ` — ${p.price}`;
      message += "\n";
    });
  }

  return message.trim();
}
