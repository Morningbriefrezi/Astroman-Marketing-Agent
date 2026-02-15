import fs from "fs";
const filePath = "./data/history.json";

export function getHistory() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(filePath));
}

export function saveProducts(products) {
  const history = getHistory();
  const updated = history.concat(products.map(p => ({
    link: p.link,
    date: new Date().toISOString()
  })));
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
}