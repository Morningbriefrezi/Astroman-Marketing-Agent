import TelegramBot from "node-telegram-bot-api";
import { generatePost, generateCaption } from "./ai/content.js";
import { generateDayCampaign, generateWeekCampaign } from "./ai/campaigns.js";
import { generateImage } from "./ai/images.js";
import { generatePromo } from "./ai/promo.js";
import { scrapeGeorgianViral } from "./scrapers/georgianShops.js";

const HELP_TEXT = `
🪐 *ASTROMAN Marketing Agent*

*კონტენტი:*
/telescope — ტელესკოპის პოსტი
/lamps — ლამპების პოსტი
/levitating — ლევიტაციური ლამპის პოსტი
/kids — ბავშვთა სათამაშოების პოსტი
/caption [პროდუქტი] — მოკლე Instagram caption
/promo [პროდუქტი] — აქციის ტექსტი

*კამპანიები:*
/daycampaign — დღიური გეგმა
/weekcampaign — 7-დღიანი გეგმა

*გამოსახულება:*
/image [აღწერა] — AI სურათი DALL-E 3-ით

*კვლევა:*
/viralge — ვირუსული პროდუქტები MyMarket.ge-დან
`.trim();

function safeReply(bot, chatId, text) {
  const safe = text || "❌ პასუხი ვერ მოვამზადე.";
  return bot.sendMessage(chatId, safe, { parse_mode: "Markdown" }).catch(() =>
    bot.sendMessage(chatId, safe)
  );
}

async function handle(bot, msg, fn) {
  const chatId = msg.chat.id;
  const thinking = await bot.sendMessage(chatId, "⏳ ვამზადებ...");
  try {
    const result = await fn();
    await bot.deleteMessage(chatId, thinking.message_id).catch(() => {});
    await safeReply(bot, chatId, result);
  } catch (err) {
    await bot.deleteMessage(chatId, thinking.message_id).catch(() => {});
    await bot.sendMessage(chatId, `❌ შეცდომა: ${err.message}`);
    console.error(err);
  }
}

export function startBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

  console.log("🚀 Astroman Marketing Bot started");

  bot.onText(/\/(start|help)/, (msg) => {
    bot.sendMessage(msg.chat.id, HELP_TEXT, { parse_mode: "Markdown" });
  });

  bot.onText(/\/telescope/, (msg) =>
    handle(bot, msg, () => generatePost("ტელესკოპი", "facebook"))
  );

  bot.onText(/\/lamps/, (msg) =>
    handle(bot, msg, () => generatePost("ვარსკვლავური ლამპები", "facebook"))
  );

  bot.onText(/\/levitating/, (msg) =>
    handle(bot, msg, () => generatePost("ლევიტაციური ლამპა", "instagram"))
  );

  bot.onText(/\/kids/, (msg) =>
    handle(bot, msg, () => generatePost("ბავშვთა სათამაშოები", "facebook"))
  );

  bot.onText(/\/caption (.+)/, (msg, match) =>
    handle(bot, msg, () => generateCaption(match[1]))
  );

  bot.onText(/\/caption$/, (msg) => {
    bot.sendMessage(msg.chat.id, "⚠️ მიუთითე პროდუქტი: `/caption ტელესკოპი`", { parse_mode: "Markdown" });
  });

  bot.onText(/\/promo (.+)/, (msg, match) =>
    handle(bot, msg, () => generatePromo(match[1]))
  );

  bot.onText(/\/promo$/, (msg) => {
    bot.sendMessage(msg.chat.id, "⚠️ მიუთითე პროდუქტი: `/promo ტელესკოპი`", { parse_mode: "Markdown" });
  });

  bot.onText(/\/daycampaign/, (msg) =>
    handle(bot, msg, () => generateDayCampaign())
  );

  bot.onText(/\/weekcampaign/, (msg) =>
    handle(bot, msg, () => generateWeekCampaign())
  );

  bot.onText(/\/image (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    handle(bot, msg, async () => {
      const imageUrl = await generateImage(match[1]);
      await bot.sendPhoto(chatId, imageUrl);
      return null;
    });
  });

  bot.onText(/\/image$/, (msg) => {
    bot.sendMessage(msg.chat.id, "⚠️ მიუთითე თემა: `/image ტელესკოპი კოსმოსში`", { parse_mode: "Markdown" });
  });

  bot.onText(/\/viralge/, (msg) =>
    handle(bot, msg, () => scrapeGeorgianViral())
  );
}
