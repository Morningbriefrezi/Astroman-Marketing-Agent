import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImage(topic) {
  const prompt = `Ultra realistic product photography of ${topic}. Cosmic dark background with luxury studio lighting. Professional e-commerce shot. Cinematic, high detail, 4K quality.`;

  const result = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024",
    quality: "standard",
    n: 1
  });

  return result.data[0].url;
}
