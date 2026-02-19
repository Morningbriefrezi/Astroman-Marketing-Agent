import OpenAI from "openai";
import { buildPostPrompt, buildCaptionPrompt } from "../utils/prompts.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePost(productType, platform = "facebook") {
  const prompt = buildPostPrompt(productType, platform);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.9,
    messages: [
      {
        role: "system",
        content: "შენ ხარ ASTROMAN-ის მთავარი მარკეტინგ დირექტორი. წერ ქართულად. შენი სტილი: ემოციური, გამყიდველი, ენერგიული."
      },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}

export async function generateCaption(topic) {
  const prompt = buildCaptionPrompt(topic);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.9,
    messages: [
      {
        role: "system",
        content: "შენ ხარ ASTROMAN-ის Instagram მენეჯერი. წერ მოკლე, ძლიერ, ემოციურ ქართულ კაფციებს emoji-ებით და ჰეშთეგებით."
      },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}
