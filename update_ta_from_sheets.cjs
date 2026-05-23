const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 引数のパース (--round=2, --test=true など)
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  args[key.replace(/^--/, '')] = value;
});

let round = parseInt(args.round) || null;
const isTestMode = args.test === 'true';
let sheetName = isTestMode ? 'Test_TA' : '';

async function getLatestRound(sheets, spreadsheetId) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = meta.data.sheets.map(s => s.properties.title);
    
    let maxRound = 2; // デフォルトの最低値
    sheetNames.forEach(name => {
      const match = name.match(/Season3Rd([0-9]+)_TA/);
      if (match) {
        const r = parseInt(match[1]);
        if (r > maxRound) {
          maxRound = r;
        }
      }
    });
    return maxRound;
  } catch (err) {
    console.error('[Warning] Failed to auto-detect latest round from sheet names:', err.message);
    return 2;
  }
}

const nameMapping = {
  "KH-KMS": "KH-AE86KMS"
};

function normalizeCarName(car) {
  if (!car) return 'Unknown';
  return car
    .replace(/PEIGEOT/gi, 'Peugeot')
    .replace(/^\//, '') // 冒頭の / を削除
    .trim();
}

function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 999999;
  const clean = timeStr.replace(/'/g, ':').replace(/\./g, ':').trim();
  const parts = clean.split(':');
  try {
    if (parts.length === 3) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 1000;
    } else if (parts.length === 2) {
      return parseInt(parts[0]) + parseInt(parts[1]) / 1000;
    }
  } catch (e) {
    return 999999;
  }
  return 999999;
}

async function updateTAFromSheets() {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key) env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n');
  });

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_CLIENT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1Ivkw-PybsyYmd-GZ9DPaUnhWYNDkG1QvL64NVNOwD_k';

  if (!round) {
    console.log('[Config] Round was not specified. Auto-detecting latest round...');
    round = await getLatestRound(sheets, spreadsheetId);
  }
  
  if (!isTestMode) {
    sheetName = `Season3Rd${round}_TA`;
  }
  
  console.log(`[Config] Reading from Sheet: ${sheetName}`);
  console.log(`[Config] Targeting Round on site: ${round}`);

  const range = `${sheetName}!A2:H100`;

  try {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;
    if (!rows || rows.length === 0) return;

    let driverMap = new Map();

    rows.forEach(row => {
      let name = (row[2] || '').trim();
      name = name.replace(/\s*\(\s*※\s*仮\s*です\s*\)\s*/g, '').trim();
      name = name.replace(/^：/, '').trim(); // Remove leading colon if present
      const timeStr = (row[6] || row[5] || '').trim(); // Try normalized time first, then raw
      if (!name || !timeStr) return;

      if (nameMapping[name]) name = nameMapping[name];

      const seconds = parseTimeToSeconds(timeStr);
      let category = (row[3] || '').toUpperCase();
      if (category.includes('HY')) category = 'HYPERCAR';
      if (category.includes('GT3')) category = 'LMGT3';

      let rawAtt = row[7] || '';
      let attempt = parseInt(rawAtt.toString().replace(/[^0-9]/g, ''));
      if (isNaN(attempt) || attempt > 100) attempt = 1;

      const entry = {
        name,
        class: category,
        car: normalizeCarName(row[4]),
        time: timeStr,
        seconds: seconds,
        attempt: attempt
      };

      if (!driverMap.has(name) || seconds < driverMap.get(name).seconds) {
        driverMap.set(name, entry);
      }
    });

    const results = Array.from(driverMap.values());
    results.sort((a, b) => a.seconds - b.seconds);

    const taDataPath = path.join(__dirname, 'src/data/timeAttackData.js');
    let content = fs.readFileSync(taDataPath, 'utf8');

    const resultsStr = results.map(r => 
      `        { name: "${r.name}", class: "${r.class}", car: "${r.car}", time: "${r.time}", attempt: ${r.attempt} }`
    ).join(',\n');

    const resultsSectionRegex = new RegExp(`("${round}":\\s*{\\s*image:\\s*"[^"]*",\\s*results:\\s*\\[)([\\s\\S]*?)(\\s*\\].*},)`);
    
    if (resultsSectionRegex.test(content)) {
        content = content.replace(resultsSectionRegex, `$1\n${resultsStr}\n      $3`);
    } else {
        content = content.replace(/results: \[[\s\S]*?\]/, `results: [\n${resultsStr}\n        ]`);
    }

    fs.writeFileSync(taDataPath, content);
    console.log(`Successfully updated Time Attack data with cleaned car names.`);

  } catch (err) {
    console.error(err);
  }
}

updateTAFromSheets();
