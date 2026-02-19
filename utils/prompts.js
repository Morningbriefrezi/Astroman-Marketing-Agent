export function buildPostPrompt(productType, platform = "facebook") {
  const platformGuide = {
    facebook: "Facebook-ისთვის: 150-250 სიტყვა, ემოციური, storytelling, ბოლოს CTA + კომენტარის მოწვევა.",
    instagram: "Instagram-ისთვის: 80-120 სიტყვა, emoji-ებით გამდიდრებული, ჰეშთეგები ბოლოს (8-12 ცალი).",
    tiktok: "TikTok-ისთვის: 50-80 სიტყვა, ენერგიული, hook პირველ წინადადებაში, trend ენა."
  };

  return `
შექმენი ${platform.toUpperCase()} პოსტი ASTROMAN-ისთვის.

პროდუქტი: ${productType}
ფორმატი: ${platformGuide[platform] || platformGuide.facebook}

სტრუქტურა:
1. 🔥 HOOK — პირველი წინადადება უნდა გაჩეროს გადახვევა
2. 💡 BENEFIT — რა სარგებელს მოიტანს პროდუქტი (არა specs, არამედ გრძნობა)
3. ✨ SOCIAL PROOF — 1 მოკლე გამოძახება ("ჩვენი კლიენტები ამბობენ...")
4. 🎯 CTA — კონკრეტული მოქმედება
5. #ჰეშთეგები — 8-10 ქართული + ინგლისური

Emoji-ები გამოიყენე ბუნებრივად, ყოველ პარაგრაფს წინ.
დაწერე ისე, რომ კითხვისას გულმა წაიყვანოს.
`;
}

export function buildCaptionPrompt(topic) {
  return `
დაწერე მოკლე Instagram კაფცია ASTROMAN-ის პროდუქტისთვის.

თემა: ${topic}

მოთხოვნები:
• 2-4 წინადადება, ძლიერი ემოცია
• 4-6 emoji ბუნებრივად გამოყენებული
• ბოლოს 10-12 ჰეშთეგი (ქართული + ინგლისური)
• ბოლო წინადადება — CTA ("ნახე ლინკი bio-ში" ან "დაგვიკავშირდი")

სტილი: კოსმოსური, პრემიუმ, ოცნებისკენ მიმართული.
`;
}
