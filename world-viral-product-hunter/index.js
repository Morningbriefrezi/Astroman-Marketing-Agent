import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { keywords } from "./keywords.js";
import { fetchProducts } from "./sources/aliexpress.js";
import { calculateScore } from "./utils/scoring.js";
import { getHistory, saveProducts } from "./utils/history.js";
import { sendTelegram } from "./telegram.js";

let currentDay = 1;

async function runHunter() {
  const history = getHistory();
  const usedLinks = new Set(history.map(h => h.link));
  let collected = [];

  for (let keyword of keywords) {
    if (collected.length >= 10) break;

    const products = await fetchProducts(keyword);

    const filtered = products
      .filter(p =>
        p.orders > 500 &&
        p.rating >= 4.3 &&
        p.price < 40 &&
        !usedLinks.has(p.link)
      )
      .map(p => ({ ...p, score: calculateScore(p) }))
      .sort((a, b) => b.score - a.score);

    for (let p of filtered) {
      if (collected.length >= 10) break;
      collected.push(p);
      usedLinks.add(p.link);
    }
  }

  if (collected.length === 0) return;

  saveProducts(collected);

  let message = `🚀 WORLD VIRAL PRODUCT REPORT - Day ${currentDay}\n\n`;

  collected.forEach((p, i) => {
    message += `${i+1}) ${p.name}\n`;
    message += `Price: $${p.price.toFixed(2)}\n`;
    message += `Orders: ${p.orders}\n`;
    message += `Rating: ${p.rating.toFixed(1)}\n`;
    message += `Link: ${p.link}\n\n`;
  });

  await sendTelegram(message);

  currentDay++;
  if (currentDay > 15) process.exit();
}

cron.schedule("0 5 * * *", runHunter);
runHunter();