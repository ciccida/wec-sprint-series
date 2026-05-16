
import { raceResults } from './src/data/raceResults.js';
import { rankingData, rounds } from './src/data/ranking.js';
import fs from 'fs';

const getPoints = (pos) => {
    const system = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    return system[pos - 1] || 0;
};

// Driver name mapping from raceResults to rankingData
const nameMap = {
    "MUHI TAMAKI": "Muhi Tamaki",
    "Nobasan": "Noba San",
    "TOMOYA ONODERA": "Tomoya Onodera",
    "R.MIYAMOTO": "Ryoma Miyamoto",
    "simzo": "simzo hunt",
    "kaeru uenchu": "Kaeru Uenchu",
    "YUKI GT": "GT YUKI",
    "TOITOI TOYS": "ToiToi Toys",
    "Milfoil Strike": "milfoil strike",
    "SOTA ITO": "Sota Ito",
    "S Shippou": "Sushi Shippou",
    "KH-KMS": "KH-AE KMS",
    "MASA MATSUMURA": "Masa Matsumura",
    "SARA MAYO": "Sara Mayo"
};

const inverseNameMap = {};
Object.entries(nameMap).forEach(([rankName, raceName]) => {
    inverseNameMap[raceName] = rankName;
});

const rd4Results = raceResults["4"];
const rd4PointsMap = {}; // rankName -> points

let hyperCount = 0;
let gt3Count = 0;

rd4Results.forEach(r => {
    let rankName = inverseNameMap[r.driver] || r.driver;
    let pts = 0;
    if (r.category === 'Hypercar' && !r.time.includes('DNF')) {
        hyperCount++;
        pts = getPoints(hyperCount);
    } else if (r.category === 'LMGT3' && !r.time.includes('DNF')) {
        gt3Count++;
        pts = getPoints(gt3Count);
    }
    rd4PointsMap[rankName] = pts;
});

const updatedRanking = rankingData.map(d => {
    const newPoints = [...d.points];
    newPoints[3] = rd4PointsMap[d.name] || 0;
    return {
        ...d,
        points: newPoints
    };
});

// Check for new drivers not in rankingData
const existingNames = new Set(rankingData.map(d => d.name));
let nextId = Math.max(...rankingData.map(d => d.id)) + 1;

Object.keys(rd4PointsMap).forEach(name => {
    if (!existingNames.has(name)) {
        const pts = [null, null, null, rd4PointsMap[name], null, null, null, null];
        updatedRanking.push({
            id: nextId++,
            name: name,
            points: pts
        });
    }
});

const content = `export const rankingData = ${JSON.stringify(updatedRanking, null, 4)};\n\nexport const rounds = ${JSON.stringify(rounds, null, 4)};\n`;

fs.writeFileSync('./src/data/ranking.js', content);
console.log("Updated ranking.js successfully.");
