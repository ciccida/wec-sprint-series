const fs = require('fs');

const rd8Points = {
  "Koki Yamamoto": 25,
  "Muhi Tamaki": 18,
  "Sara Mayo": 15,
  "Macky Takagi": 12,
  "GT YUKI": 10,
  "aJ fault": 8,
  "Shingo Koyabu": 25,
  "Daitou Hatsune": 18,
  "Tomoya Onodera": 15,
  "H MOS": 12,
  "Shingen Mochi": 10,
  "Fniku Neko": 8,
  "Seiken Xa": 6,
  "yas mishi": 4,
  "simzo hunt": 2,
  "milfoil strike": 6,
  "Stefano Ricchiuti": 4
};

const nameMap = {
  "MUHI TAMAKI": "Muhi Tamaki",
  "TOMOYA ONODERA": "Tomoya Onodera",
  "Nobasan": "Noba San",
  "SARA MAYO": "Sara Mayo",
  "MASA MATSUMURA": "Masa Matsumura",
  "R.MIYAMOTO": "Ryoma Miyamoto",
  "KH-KMS": "KH-AE KMS",
  "simzo": "simzo hunt",
  "TOITOI TOYS": "ToiToi Toys",
  "KEI SAGAWA": "Kei Sagawa",
  "Milfoil Strike": "milfoil strike",
  "kaeru uenchu": "Kaeru Uenchu",
  "RAPID TUYOPON": "Rapid Tuyopon",
  "YUKI GT": "GT YUKI",
  "S Shippou": "Sushi Shippou"
};

const rankingFile = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/ranking.js';
let content = fs.readFileSync(rankingFile, 'utf8');

// Parse Vol2 data manually if needed, but let's try a better regex
const vol2Match = content.match(/"Vol2":\s*\[([\s\S]*?)\n\s*\]/);
if (!vol2Match) {
  console.error("Could not find Vol2 data");
  process.exit(1);
}

// Convert to objects
const lines = vol2Match[1].split('\n').filter(l => l.trim().startsWith('{'));
let vol2Data = lines.map(line => {
    // Remove trailing comma if exists
    let cleanLine = line.trim();
    if (cleanLine.endsWith(',')) cleanLine = cleanLine.slice(0, -1);
    return JSON.parse(cleanLine);
});

// Update points
vol2Data.forEach(driver => {
  const stdName = nameMap[driver.name] || driver.name;
  const points = rd8Points[stdName] || 0;
  if (!driver.points) driver.points = [0,0,0,0,0,0,0,0];
  driver.points[7] = points;
});

// Calculate totals
vol2Data.forEach(driver => {
  driver.total = driver.points.reduce((a, b) => (a || 0) + (b || 0), 0);
});

// Sort
vol2Data.sort((a, b) => b.total - a.total);

// Ranks
let currentRank = 1;
vol2Data.forEach((driver, i) => {
  if (i > 0 && driver.total < vol2Data[i - 1].total) {
    currentRank = i + 1;
  }
  driver.rank = currentRank;
  delete driver.total;
});

// Reconstruct file
const vol2Json = vol2Data.map(d => `    ${JSON.stringify(d)}`).join(',\n');
let newContent = content.replace(/"Vol2":\s*\[[\s\S]*?\n\s*\]/, `"Vol2": [\n${vol2Json}\n  ]`);

// Remove Vol3
newContent = newContent.replace(/,\s*"Vol3":\s*\[\]\s*\/\/ 将来用/, '');
newContent = newContent.replace(/,\s*"Vol3":\s*\[[\s\S]*?\]/, '');

fs.writeFileSync(rankingFile, newContent);
console.log("Updated ranking.js successfully");
