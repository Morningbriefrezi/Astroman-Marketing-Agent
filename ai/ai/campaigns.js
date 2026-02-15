import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateDayCampaign() {
  const prompt = `
შექმენი დღიური მარკეტინგ კამპანია ASTROMAN-ისთვის.
მოიცავს:
- 3 პოსტს
- 2 სთორის იდეას
- რეკლამის სტრუქტურას
- ბიუჯეტის რეკომენდაციას
- სამიზნე აუდიტორიას
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.8,
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}

export async function generateWeekCampaign() {
  const prompt = `
შექმენი 7 დღიანი მარკეტინგ გეგმა ASTROMAN-ისთვის.
მოიცავს:
- ყოველდღიური კონტენტის იდეებს
- რეკლამის სტრატეგიას
- აქციებს
- გაყიდვების მიზნებს
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.8,
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}
