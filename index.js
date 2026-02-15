import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import fs from "fs";
import { fetchAmazon } from "./sources/amazon.js";
import { fetchAliExpress } from "./sources/aliexpress.js";
import { fetchTikTokTrends } from "./sources/tiktok.js";
import { scoreProducts } from "./utils/scoring.js";
import { getKeywords } from "./utils/keywords.js";
import { sendToTelegram } from "./telegram.js";

const HISTORY_FILE = "./data/history.json";


if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify({ products: [] }, null, 2));
}

function loadHistory() {
  return JSON.parse(fs.readFileSync(HISTORY_FILE));
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

async function runHunter() {
  console.log("🚀 Running World Viral Product Hunter...");

  const history = loadHistory();
  const usedLinks = new Set(history.products.map(p => p.link));

  const keywords = getKeywords();
  const trendKeywords = await fetchTikTokTrends();

  let candidates = [];

  for (const keyword of keywords) {
    const amazon = await fetchAmazon(keyword);
    const ali = await fetchAliExpress(keyword);
    candidates.push(...amazon, ...ali);
  }

  candidates = candidates.filter(p =>
    p.orders > 500 &&
    p.rating >= 4.3 &&
    p.price < 40 &&
    !usedLinks.has(p.link)
  );

  const scored = scoreProducts(candidates, trendKeywords);

  const selected = scored.slice(0, 10);

  if (selected.length === 0) {
    console.log("No new products found.");
    return;
  }

  let message = `🚀 WORLD VIRAL PRODUCT REPORT\n\n`;

  selected.forEach((p, i) => {
    message += `${i + 1}) ${p.name}
Price: $${p.price}
Orders: ${p.orders}
Rating: ${p.rating}
Link: ${p.link}

`;
    history.products.push({ link: p.link, date: new Date().toISOString() });
  });

  saveHistory(history);
  await sendToTelegram(message);

  console.log("✅ Done.");
}

runHunter();

cron.schedule("0 5 * * *", runHunter);
