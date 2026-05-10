const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

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
  const range = 'Season3Rd1_TA!B2:H100';

  try {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;
    if (!rows || rows.length === 0) return;

    let driverMap = new Map();

    rows.forEach(row => {
      let name = (row[1] || '').trim();
      const timeStr = (row[4] || '').trim();
      if (!name || !timeStr) return;

      if (nameMapping[name]) name = nameMapping[name];

      const seconds = parseTimeToSeconds(timeStr);
      let category = (row[2] || '').toUpperCase();
      if (category.includes('HY')) category = 'HYPERCAR';
      if (category.includes('GT3')) category = 'LMGT3';

      let rawAtt = row[6] || '';
      let attempt = parseInt(rawAtt.toString().replace(/[^0-9]/g, ''));
      if (isNaN(attempt) || attempt > 100) attempt = 1;

      const entry = {
        name,
        class: category,
        car: normalizeCarName(row[3]),
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

    const resultsSectionRegex = /("Vol3":\s*{\s*"1":\s*{\s*image:\s*"\/images\/ta_s3_rd1.jpg",\s*results:\s*\[)([\s\S]*?)(\]\s*},)/;
    
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
