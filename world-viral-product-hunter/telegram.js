import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendTelegram(message) {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      disable_web_page_preview: true
    }
  );
}