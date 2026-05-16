const fs = require('fs');
const path = require('path');

const monzaResults = JSON.parse(fs.readFileSync('/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/monza_main_table.json', 'utf8'));
const vol2Ranking = JSON.parse(fs.readFileSync('/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/vol2_ranking_raw_v2.json', 'utf8') || '[]');
// If v2 is empty, we use the browser result text. Actually I will use the browser text manually in the script.

// --- 1. Update raceResults.js ---
const raceResultsPath = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/raceResults.js';
let raceResultsContent = fs.readFileSync(raceResultsPath, 'utf8');

const monzaFormatted = monzaResults.map(r => {
    // Clean up strings
    const name = r.name.split('>').pop().trim();
    const car = r.car.split('>').pop().trim();
    const pos = r.pos.replace('>', '').trim();
    const best = r.bestLap.split('>').pop().trim();
    let time = r.laps.replace('class="">', '').trim();
    
    return {
        pos: pos,
        driver: name,
        team: name,
        car: car,
        category: r.class === "Hypercar" ? "Hypercar" : "LMGT3",
        time: time,
        gap: "-",
        best: best
    };
});

// Update Vol3 Rd1 in raceResults
const vol3Rd1Str = JSON.stringify(monzaFormatted, null, 12).replace(/"/g, '"');
// Inject into Vol3 section
const vol3Regex = /"Vol3":\s*{[^}]*}/;
if (vol3Regex.test(raceResultsContent)) {
    // Round 1 might already exist as empty or old
    const rd1Regex = /"1":\s*\[[\s\S]*?\]/;
    raceResultsContent = raceResultsContent.replace(rd1Regex, `"1": ${JSON.stringify(monzaFormatted, null, 12)}`);
} else {
    // Add Vol3 section before the end of the object
    raceResultsContent = raceResultsContent.replace(/};\s*$/, `    "Vol3": {\n        "1": ${JSON.stringify(monzaFormatted, null, 12)}\n    }\n};`);
}

fs.writeFileSync(raceResultsPath, raceResultsContent);
console.log("Updated raceResults.js with Monza results.");

// --- 2. Update ranking.js ---
const rankingPath = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/ranking.js';
let rankingContent = fs.readFileSync(rankingPath, 'utf8');

// I will manually reconstruct the Vol2 and Vol3 ranking objects based on the browser subagent output
const vol2Data = [
  { id: 1, rank: 1, name: "Koki Yamamoto", points: [25, 25, 18, 25, 25, 2, 8, 25] },
  { id: 2, rank: 2, name: "MUHI TAMAKI", points: [25, 25, 2, 18, 25, 0, 18, 18] },
  { id: 10, rank: 3, name: "Shingo Koyabu", points: [0, 10, 0, 25, 18, 25, 2, 25] },
  { id: 4, rank: 4, name: "TOMOYA ONODERA", points: [18, 8, 6, 15, 15, 0, 25, 15] },
  { id: 11, rank: 5, name: "Shingen Mochi", points: [10, 6, 4, 12, 18, 25, 12, 10] },
  { id: 3, rank: 6, name: "A Plasma", points: [18, 0, 15, 15, 1, 0, 25, 0] },
  { id: 5, rank: 7, name: "Macky Takagi", points: [12, 0, 12, 18, 2, 15, 0, 12] },
  { id: 8, rank: 8, name: "Nobasan", points: [0, 10, 18, 12, 0, 12, 15, 0] },
  { id: 6, rank: 9, name: "SARA MAYO", points: [0, 15, 25, 1, 10, 0, 0, 15] },
  { id: 17, rank: 10, name: "MASA MATSUMURA", points: [0, 18, 1, 0, 8, 18, 12, 0] },
  { id: 13, rank: 11, name: "Fniku Neko", points: [15, 12, 0, 0, 6, 12, 0, 8] },
  { id: 7, rank: 12, name: "Hayata Asaga", points: [0, 15, 25, 0, 12, 0, 0, 0] },
  { id: 14, rank: 13, name: "Daitou Hatsune", points: [0, 12, 15, 0, 0, 0, 0, 18] },
  { id: 30, rank: 14, name: "H.MOS", points: [0, 0, 0, 2, 15, 0, 15, 12] },
  { id: 12, rank: 14, name: "ziggy Katsuya", points: [8, 0, 12, 8, 6, 10, 0, 0] },
  { id: 9, rank: 16, name: "SOTA ITO", points: [10, 18, 0, 8, 0, 0, 0, 0] },
  { id: 25, rank: 17, name: "Naofumi Ishida", points: [0, 0, 0, 10, 8, 0, 0, 10] },
  { id: 15, rank: 18, name: "R.MIYAMOTO", points: [12, 6, 8, 0, 0, 0, 2, 0] },
  { id: 16, rank: 19, name: "momigi tetuo", points: [6, 8, 0, 10, 0, 0, 0, 0] },
  { id: 51, rank: 20, name: "Seiken Xa", points: [0, 0, 0, 0, 0, 0, 24, 0] },
  { id: 28, rank: 21, name: "kaeru uenchu", points: [1, 2, 0, 0, 10, 0, 10, 0] },
  { id: 21, rank: 22, name: "simzo", points: [0, 4, 8, 2, 0, 6, 0, 2] },
  { id: 43, rank: 23, name: "Stefano Ricchiuti", points: [0, 0, 0, 0, 0, 0, 4, 18] },
  { id: 19, rank: 24, name: "KH-KMS", points: [0, 4, 6, 4, 4, 2, 0, 1] },
  { id: 24, rank: 25, name: "Milfoil Strike", points: [0, 0, 10, 0, 0, 4, 0, 6] },
  { id: 39, rank: 26, name: "Tomoki Hirose", points: [0, 0, 0, 0, 12, 0, 8, 0] },
  { id: 26, rank: 27, name: "KEI SAGAWA", points: [8, 0, 0, 0, 1, 6, 4, 0] },
  { id: 22, rank: 28, name: "TOITOI TOYS", points: [6, 0, 0, 6, 2, 4, 0, 0] },
  { id: 27, rank: 29, name: "aJ fault", points: [0, 1, 4, 0, 4, 1, 0, 8] },
  { id: 38, rank: 30, name: "Fusahiro Endo", points: [0, 0, 0, 0, 0, 18, 0, 0] },
  { id: 50, rank: 31, name: "yas mishi", points: [0, 0, 0, 0, 0, 8, 10, 0] },
  { id: 18, rank: 32, name: "satou naoto", points: [15, 0, 0, 0, 0, 0, 0, 0] },
  { id: 20, rank: 33, name: "Hikone Joe", points: [0, 0, 10, 4, 0, 0, 0, 0] },
  { id: 31, rank: 34, name: "RAPID TUYOPON", points: [0, 2, 0, 0, 0, 10, 1, 0] },
  { id: 33, rank: 35, name: "YUKI GT", points: [0, 1, 0, 0, 0, 10, 0, 0] },
  { id: 23, rank: 36, name: "Brendon Hatasan", points: [4, 0, 1, 6, 0, 0, 0, 0] },
  { id: 34, rank: 37, name: "YRK", points: [0, 0, 0, 1, 8, 0, 0, 0] },
  { id: 36, rank: 38, name: "Seth Koganeya", points: [0, 0, 0, 0, 0, 0, 4, 0] },
  { id: 29, rank: 39, name: "S Shippou", points: [2, 0, 0, 0, 0, 0, 0, 0] },
  { id: 32, rank: 40, name: "Touya Sougetsu", points: [0, 0, 2, 0, 0, 0, 0, 0] },
  { id: 35, rank: 41, name: "Yoshinori Tokunou", points: [0, 0, 0, 0, 0, 0, 0, 0] },
  { id: 37, rank: 42, name: "K.Kishimoto", points: [0, 0, 0, 0, 0, 0, 0, 0] }
];

// Calculate Vol3 Rd1 points
// Hypercar: Naofumi Ishida(25), Kaeru Uenchu(18), Sara Mayo(15), Stefano Ricchiuti(12), Salios SON(10), aJ fault(8), GC Eight(6), Tomoki Hirose(4), ToiToi Toys(2), milfoil strike(1)
// GT3: Koki Yamamoto(25), Muhi Tamaki(18), Shingo Koyabu(15), Daitou Hatsune(12), Masa Matsumura(10), Ryoma Miyamoto(8), Fusahiro Endo(6), Rapid Tuyopon(4), Macky Takagi(2), Yat Lam Law(1)

const vol3Points = {
    "Naofumi Ishida": [25],
    "Kaeru Uenchu": [18],
    "Sara Mayo": [15],
    "Stefano Ricchiuti": [12],
    "Salios SON": [10],
    "aJ fault": [8],
    "GC Eight": [6],
    "Tomoki Hirose": [4],
    "ToiToi Toys": [2],
    "milfoil strike": [1],
    "Koki Yamamoto": [25],
    "Muhi Tamaki": [18],
    "Shingo Koyabu": [15],
    "Daitou Hatsune": [12],
    "Masa Matsumura": [10],
    "Ryoma Miyamoto": [8],
    "Fusahiro Endo": [6],
    "Rapid Tuyopon": [4],
    "Macky Takagi": [2],
    "Yat Lam Law": [1]
};

// Map names to match Case/Exact string in existing Vol3 objects
let vol3Objects = rankingContent.match(/"Vol3":\s*\[([\s\S]*?)\]/)[1];
// I will rewrite Vol3 section based on the current list of 36 series entries
const vol3SeriesEntries = [
    { id: 25, name: "Naofumi Ishida" },
    { id: 28, name: "Kaeru Uenchu" },
    { id: 6, name: "Sara Mayo" },
    { id: 43, name: "Stefano Ricchiuti" },
    { id: 104, name: "Salios SON" },
    { id: 27, name: "aJ fault" },
    { id: 109, name: "GC Eight" },
    { id: 39, name: "Tomoki Hirose" },
    { id: 22, name: "ToiToi Toys" },
    { id: 24, name: "milfoil strike" },
    { id: 1, name: "Koki Yamamoto" },
    { id: 2, name: "Muhi Tamaki" },
    { id: 10, name: "Shingo Koyabu" },
    { id: 14, name: "Daitou Hatsune" },
    { id: 17, name: "Masa Matsumura" },
    { id: 106, name: "Ryoma Miyamoto" },
    { id: 38, name: "Fusahiro Endo" },
    { id: 31, name: "Rapid Tuyopon" },
    { id: 5, name: "Macky Takagi" },
    { id: 105, name: "Yat Lam Law" },
    { id: 13, name: "Fniku Neko" },
    { id: 51, name: "Seiken Xa" },
    { id: 50, name: "yas mishi" },
    { id: 11, name: "Shingen Mochi" },
    { id: 103, name: "KH-AE KMS" },
    { id: 12, name: "ziggy Katsuya" },
    { id: 111, name: "Yasu Tanaka" },
    { id: 101, name: "GT Yuki" },
    { id: 4, name: "Tomoya Onodera" },
    { id: 9, name: "Sota Ito" },
    { id: 107, name: "N.San" },
    { id: 108, name: "H.MOS" },
    { id: 34, name: "YRK" },
    { id: 110, name: "Touya Sougetsu" }, // Based on prev list
    { id: 35, name: "Yoshinori Tokunou" },
    { id: 37, name: "K.Kishimoto" }
];

const vol3Final = vol3SeriesEntries.map(entry => {
    const points = vol3Points[entry.name] || [0];
    return {
        id: entry.id,
        rank: 0, // Will be calculated by UI or I can sort here
        name: entry.name,
        points: points.concat(Array(7).fill(null))
    };
});

// Calculate Vol3 ranks
vol3Final.sort((a, b) => b.points[0] - a.points[0]);
vol3Final.forEach((entry, idx) => { entry.rank = idx + 1; });

const finalRankingData = {
    Vol2: vol2Data,
    Vol3: vol3Final
};

const newRankingContent = `export const rankingData = ${JSON.stringify(finalRankingData, null, 2)};\n\n` + rankingContent.substring(rankingContent.indexOf('export const rounds'));
fs.writeFileSync(rankingPath, newRankingContent);
console.log("Updated ranking.js with corrected Vol2 and new Vol3 Rd1 points.");
