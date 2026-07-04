import fs from 'fs';
import { raceResults } from '../src/data/raceResults.js';
import { rounds } from '../src/data/ranking.js';

// Dynamically import the old ranking to get the base roster
import { rankingData as oldRankingData } from '../old_ranking.js';

const POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
};

const vol2Ranking = oldRankingData["Vol2"];
let maxId = 0;
const existingDrivers = new Map();

// Load Vol2 drivers so they keep their IDs
vol2Ranking.forEach(entry => {
    const normName = entry.name.toLowerCase().replace(/[\s.]/g, ''); 
    existingDrivers.set(normName, { id: entry.id, name: entry.name });
    if (entry.id > maxId) maxId = entry.id;
});

const newVol3Map = new Map();
const totalRounds = 8;

// 1. First, seed the map with EVERYONE who was in the old Vol3 ranking
// This preserves users who registered but haven't raced yet, or got 0 points.
oldRankingData["Vol3"].forEach(entry => {
    const normName = entry.name.toLowerCase().replace(/[\s.]/g, '');
    if (entry.id > maxId) maxId = entry.id;
    existingDrivers.set(normName, { id: entry.id, name: entry.name });
    
    newVol3Map.set(normName, {
        id: entry.id,
        rank: 99,
        name: entry.name,
        // Reset points to null, we will rebuild them from raceResults
        points: Array(totalRounds).fill(null)
    });
});

const vol3Results = raceResults["Vol3"];

// 2. Rebuild points and add any NEW drivers that appear in raceResults but weren't in old ranking
Object.keys(vol3Results).forEach(roundStr => {
    const roundIdx = parseInt(roundStr, 10) - 1; // 0-indexed
    const roundData = vol3Results[roundStr];

    const hypercar = roundData.filter(r => r.category === 'Hypercar');
    const lmgt3 = roundData.filter(r => r.category === 'LMGT3');

    function processCategory(list) {
        list.forEach((r, i) => {
            const timeStr = String(r.time || '');
            let points = 0;
            if (!timeStr.includes('DNF') && !timeStr.includes('Accident') && !timeStr.includes('Suspension') && timeStr !== 'DQ') {
                points = POINTS_SYSTEM[i + 1] || 0;
            }
            
            const normName = r.driver.toLowerCase().replace(/[\s.]/g, '');
            
            if (!newVol3Map.has(normName)) {
                let id = null;
                if (existingDrivers.has(normName)) {
                    id = existingDrivers.get(normName).id;
                } else {
                    maxId++;
                    id = maxId;
                    existingDrivers.set(normName, { id, name: r.driver });
                }
                
                newVol3Map.set(normName, {
                    id: id,
                    rank: 99,
                    name: r.driver,
                    points: Array(totalRounds).fill(null)
                });
            }
            
            const entry = newVol3Map.get(normName);
            entry.points[roundIdx] = points;
            // Only update preferred name if they actually scored or raced, but let's just keep original if seeded
        });
    }

    processCategory(hypercar);
    processCategory(lmgt3);
});

// Calculate total points for sorting (not strictly necessary since frontend calculates rank, but good to have)
const newVol3Array = Array.from(newVol3Map.values());
newVol3Array.sort((a, b) => {
    const sumA = a.points.reduce((acc, val) => acc + (val || 0), 0);
    const sumB = b.points.reduce((acc, val) => acc + (val || 0), 0);
    return sumB - sumA;
});

// We load the current ranking to preserve Vol2, then overwrite Vol3
import { rankingData as currentRankingData } from '../src/data/ranking.js';
currentRankingData["Vol3"] = newVol3Array;

const rankingContent = `export const rankingData = ${JSON.stringify(currentRankingData, null, 2)};\n\nexport const rounds = ${JSON.stringify(rounds, null, 2)};\n`;
fs.writeFileSync('src/data/ranking.js', rankingContent);
console.log('Rebuilt Vol3 ranking based on raceResults.js, preserving all existing drivers');
