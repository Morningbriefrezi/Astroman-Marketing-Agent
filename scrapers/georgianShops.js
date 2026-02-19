import axios from "axios";
import * as cheerio from "cheerio";

const SOURCES = [
  {
    name: "MyMarket.ge",
    url: "https://www.mymarket.ge/ka/search/?searchWord=&categoryId=5",
    titleSelector: ".sc-1aa58py-0, .product-card__title, h3, .title",
    priceSelector: ".sc-1aa58py-1, .product-card__price, .price"
  },
  {
    name: "Extra.ge",
    url: "https://extra.ge/",
    titleSelector: ".product-title, .item-title, h3, .name",
    priceSelector: ".price, .product-price"
  }
];

export async function scrapeGeorgianViral() {
  const results = [];

  for (const source of SOURCES) {
    try {
      const { data } = await axios.get(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept-Language": "ka,en;q=0.9"
        },
        timeout: 10000
      });

      const $ = cheerio.load(data);
      const items = [];

      $(source.titleSelector).each((i, el) => {
        const title = $(el).text().trim();
        if (title.length > 5 && title.length < 120 && items.length < 8) {
          // filter out nav/footer noise
          const parent = $(el).closest("a, .product, .item, article");
          if (parent.length > 0 || title.match(/[ა-ჰ]/)) {
            items.push(title);
          }
        }
      });

      if (items.length > 0) {
        results.push(`\n📦 *${source.name}:*`);
        items.slice(0, 6).forEach((t, i) => results.push(`${i + 1}. ${t}`));
      }
    } catch (err) {
      results.push(`\n⚠️ ${source.name}: ვერ ჩაიტვირთა (${err.message})`);
    }
  }

  if (results.length === 0) {
    return "❌ ვირუსული პროდუქტები ვერ მოიძებნა. სცადეთ მოგვიანებით.";
  }

  return `🔥 *ვირუსული პროდუქტები ქართულ ბაზარზე:*\n${results.join("\n")}`;
}
