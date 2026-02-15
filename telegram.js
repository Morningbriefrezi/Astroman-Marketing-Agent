import TelegramBot from "node-telegram-bot-api";
import { generatePost } from "./ai/content.js";
import { generateDayCampaign, generateWeekCampaign } from "./ai/campaigns.js";
import { generateImage } from "./ai/images.js";
import { scrapeGeorgianViral } from "./scrapers/georgianShops.js";

export function startBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
  });

  bot.onText(/\/telescope/, async (msg) => {
    const text = await generatePost("ტელესკოპი");
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/lamps/, async (msg) => {
    const text = await generatePost("ლამპები");
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/levitating/, async (msg) => {
    const text = await generatePost("ლევიტაციური ლამპა");
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/kids/, async (msg) => {
    const text = await generatePost("ბავშვთა სათამაშოები");
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/daycampaign/, async (msg) => {
    const text = await generateDayCampaign();
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/weekcampaign/, async (msg) => {
    const text = await generateWeekCampaign();
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/image (.+)/, async (msg, match) => {
    const topic = match[1];
    const imageUrl = await generateImage(topic);
    bot.sendPhoto(msg.chat.id, imageUrl);
  });

  bot.onText(/\/viralge/, async (msg) => {
    const text = await scrapeGeorgianViral();
    bot.sendMessage(msg.chat.id, text);
  });
}
