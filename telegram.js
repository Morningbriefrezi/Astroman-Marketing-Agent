import TelegramBot from "node-telegram-bot-api";
import { generatePost, generateCaption } from "./ai/content.js";
import { generateDayCampaign, generateWeekCampaign } from "./ai/campaigns.js";
import { generateImage } from "./ai/images.js";
import { scrapeGeorgianViral } from "./scrapers/georgianShops.js";

const HELP_TEXT = `
🪐 *ASTROMAN Marketing Bot — Commands*

*Content Generation:*
/telescope — Facebook post for telescopes
/lamps — Facebook post for lamps
/levitating — Post for levitating lamps
/kids — Post for kids toys
/caption \`[topic]\` — Short Instagram caption

*Campaigns:*
/daycampaign — Full 1-day marketing plan
/weekcampaign — Full 7-day marketing plan

*Images:*
/image \`[topic]\` — Generate product image via DALL-E

*Research:*
/viralge — Scrape trending products from Georgian shops

*Help:*
/start or /help — Show this menu
`;

function safeReply(bot, chatId, text) {
  return bot.sendMessage(chatId, text, { parse_mode: "Markdown" }).catch((err) => {
    console.error("Send error:", err.message);
    bot.sendMessage(chatId, text).catch(() => {});
  });
}

async function handleCommand(bot, msg, fn, loadingMsg = "⏳ გენერირება მიმდინარეობს...") {
  const chatId = msg.chat.id;
  const loading = await bot.sendMessage(chatId, loadingMsg);
  try {
    const result = await fn();
    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
    await safeReply(bot, chatId, result);
  } catch (err) {
    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
    await safeReply(bot, chatId, `❌ შეცდომა: ${err.message}`);
    console.error(err);
  }
}

export function startBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

  console.log("✅ ASTROMAN Bot started");

  // ── Help & Start ──────────────────────────────────────────────
  bot.onText(/\/start/, (msg) => safeReply(bot, msg.chat.id, HELP_TEXT));
  bot.onText(/\/help/, (msg) => safeReply(bot, msg.chat.id, HELP_TEXT));

  // ── Product Posts ─────────────────────────────────────────────
  bot.onText(/\/telescope/, (msg) =>
    handleCommand(bot, msg, () => generatePost("ტელესკოპი", "facebook"))
  );
  bot.onText(/\/lamps/, (msg) =>
    handleCommand(bot, msg, () => generatePost("ლამპები", "facebook"))
  );
  bot.onText(/\/levitating/, (msg) =>
    handleCommand(bot, msg, () => generatePost("ლევიტაციური ლამპა", "facebook"))
  );
  bot.onText(/\/kids/, (msg) =>
    handleCommand(bot, msg, () => generatePost("ბავშვთა სათამაშოები", "facebook"))
  );

  // ── Instagram Caption ─────────────────────────────────────────
  bot.onText(/\/caption (.+)/, (msg, match) => {
    const topic = match[1].trim();
    handleCommand(bot, msg, () => generateCaption(topic), "📸 კაფცია იქმნება...");
  });
  bot.onText(/^\/caption$/, (msg) =>
    safeReply(bot, msg.chat.id, "⚠️ გამოიყენე: /caption \`[თემა]\`\nმაგ: /caption ტელესკოპი")
  );

  // ── Campaigns ─────────────────────────────────────────────────
  bot.onText(/\/daycampaign/, (msg) =>
    handleCommand(bot, msg, generateDayCampaign, "📅 დღიური კამპანია იქმნება...")
  );
  bot.onText(/\/weekcampaign/, (msg) =>
    handleCommand(bot, msg, generateWeekCampaign, "🗓️ კვირის კამპანია იქმნება...")
  );

  // ── Image Generation ──────────────────────────────────────────
  bot.onText(/\/image (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const topic = match[1].trim();
    const loading = await bot.sendMessage(chatId, "🎨 სურათი გენერირდება DALL-E-ით...");
    try {
      const imageUrl = await generateImage(topic);
      await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
      await bot.sendPhoto(chatId, imageUrl, { caption: `🪐 ${topic}` });
    } catch (err) {
      await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
      await safeReply(bot, chatId, `❌ სურათის გენერაცია ვერ მოხერხდა: ${err.message}`);
    }
  });
  bot.onText(/^\/image$/, (msg) =>
    safeReply(bot, msg.chat.id, "⚠️ გამოიყენე: /image \`[თემა]\`\nმაგ: /image telescope in space")
  );

  // ── Viral Scraper ─────────────────────────────────────────────
  bot.onText(/\/viralge/, (msg) =>
    handleCommand(bot, msg, scrapeGeorgianViral, "🔍 სქრეპინგი მიმდინარეობს...")
  );
}
