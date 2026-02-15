import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeGeorgianViral() {
  try {
    const { data } = await axios.get("https://vendoo.ge", {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 8000
    });

    const $ = cheerio.load(data);
    let results = [];

    $("a").each((i, el) => {
      const title = $(el).text().trim();
      if (title.length > 20 && results.length < 10) {
        results.push(title);
      }
    });

    if (results.length === 0) {
      return "ვერ მოიძებნა პროდუქტები.";
    }

    return "🔥 სავარაუდო ვირუსული პროდუქტები:\n\n" + results.join("\n");
  } catch {
    return "სქრეპინგი ვერ განხორციელდა.";
  }
}
