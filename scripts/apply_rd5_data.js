import fs from 'fs';
import { raceResults } from '../src/data/raceResults.js';
import { rankingData, rounds } from '../src/data/ranking.js';

const RESULTS_FILE = 'src/data/raceResults.js';
const RANKING_FILE = 'src/data/ranking.js';
const PARSED_JSON = 'rd5_parsed.json';

const POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
};

async function run() {
    const rd5Data = JSON.parse(fs.readFileSync(PARSED_JSON, 'utf8'));

    // 1. Update raceResults
    raceResults["Vol3"]["5"] = rd5Data;
    
    // Write raceResults back
    const resultsContent = `export const raceResults = ${JSON.stringify(raceResults, null, 4)};\n`;
    fs.writeFileSync(RESULTS_FILE, resultsContent);
    console.log(`Updated ${RESULTS_FILE}`);

    // 2. Update rankingData
    let vol3Ranking = rankingData["Vol3"];
    
    // Map of normalized name to entry
    const existingDrivers = new Map();
    let maxId = 0;
    
    vol3Ranking.forEach(entry => {
        const normName = entry.name.toLowerCase().replace(/\s/g, '');
        existingDrivers.set(normName, entry);
        if (entry.id > maxId) maxId = entry.id;
    });

    const hypercar = rd5Data.filter(r => r.category === 'Hypercar');
    const lmgt3 = rd5Data.filter(r => r.category === 'LMGT3');

    function assignPoints(raceList) {
        raceList.forEach((r, i) => {
            const timeStr = String(r.time || '');
            // DNF drivers also get points based on class ranking

            const p = i + 1;
            let points = POINTS_SYSTEM[p] || 0;
            if (timeStr === 'DQ') points = 0;
            
            const normName = r.driver.toLowerCase().replace(/\s/g, '');
            if (existingDrivers.has(normName)) {
                const entry = existingDrivers.get(normName);
                // Ensure points array has 8 elements
                while (entry.points.length < 8) entry.points.push(null);
                entry.points[4] = points; // Index 4 is Rd5
            } else if (points > 0) {
                console.log(`New Driver Found! ${r.driver} - adding to Vol3 ranking.`);
                maxId++;
                    const newEntry = {
                        id: maxId,
                        rank: 99,
                        name: r.driver,
                        points: [null, null, null, points, null, null, null, null]
                    };
                    vol3Ranking.push(newEntry);
                    existingDrivers.set(normName, newEntry);
                }
        });
    }

    assignPoints(hypercar);
    assignPoints(lmgt3);
    
    // Write rankingData back
    const rankingContent = `export const rankingData = ${JSON.stringify(rankingData, null, 2)};\n\nexport const rounds = ${JSON.stringify(rounds, null, 2)};\n`;
    fs.writeFileSync(RANKING_FILE, rankingContent);
    console.log(`Updated ${RANKING_FILE}`);
}

run().catch(console.error);
