const { chromium } = require('playwright');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 引数のパース (--round=3, --test=true など)
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  args[key.replace(/^--/, '')] = value;
});

let round = parseInt(args.round) || null;
const isTestMode = args.test === 'true';
let sheetName = isTestMode ? 'Test_TA' : '';
let hashtag = '';

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
  "KH-KMS": "KH-AE86KMS",
  "KH-AEKMS": "KH-AE86KMS",
  "KH-AE KMS": "KH-AE86KMS"
};

function normalizeCarName(car) {
  if (!car) return 'Unknown';
  return car
    .replace(/PEIGEOT/gi, 'Peugeot')
    .replace(/^\//, '')
    .trim();
}

// ツイート本文から各要素を直接パースする関数
function parseTweetText(text) {
  let name = '';
  let category = '';
  let car = '';
  let timeStr = '';
  let attemptText = '1回目';

  // 1. エントリー名の抽出
  const nameMatch = text.match(/\[?エントリー名\]?\s*[:：]?\s*([^\n]+)/i);
  if (nameMatch) {
    name = nameMatch[1].replace(/^：/, '').trim();
    name = name.replace(/\s*\(\s*※\s*仮\s*です\s*\)\s*/g, '').trim();
    if (nameMapping[name]) name = nameMapping[name];
  }

  // 2. 車両(カテゴリ・車両名)の抽出
  const carMatch = text.match(/\[?車両[（(]カテゴリ・車両名[）)]?\]?\s*[:：]?\s*([^\n]+)/i);
  if (carMatch) {
    const rawCar = carMatch[1].replace(/^：/, '').trim();
    // カテゴリと車両名に分解
    if (rawCar.toUpperCase().includes('HY') || rawCar.includes('プジョー')) {
      category = 'HY';
      // 車両名の正規化
      if (rawCar.includes('プジョー') || rawCar.includes('PEUGEOT')) {
        car = 'Peugeot 9X8';
      } else if (rawCar.includes('Porsche') || rawCar.includes('ポルシェ') || rawCar.includes('963')) {
        car = 'Porsche 963';
      } else {
        car = normalizeCarName(rawCar.replace(/HY\s*・?/i, ''));
      }
    } else if (rawCar.toUpperCase().includes('GT3') || rawCar.includes('Lexus') || rawCar.includes('BMW') || rawCar.includes('Ferrari')) {
      category = 'LMGT3';
      if (rawCar.includes('Lexus') || rawCar.includes('LEXUS')) {
        car = 'Lexus RC F LMGT3';
      } else if (rawCar.includes('BMW') || rawCar.includes('M4')) {
        car = 'BMW M4 LMGT3 Evo';
      } else if (rawCar.includes('Ferrari') || rawCar.includes('フェラーリ') || rawCar.includes('296')) {
        car = 'Ferrari 296 LMGT3';
      } else {
        car = normalizeCarName(rawCar.replace(/LMGT3\s*・?/i, ''));
      }
    } else {
      car = normalizeCarName(rawCar);
    }
  }

  // 3. タイムの抽出
  const timeMatch = text.match(/\[?タイム\]?\s*[:：]?\s*([^\n]+)/i);
  if (timeMatch) {
    timeStr = timeMatch[1].replace(/^：/, '').replace(/[　\s]/g, '').trim();
    // タイム形式の標準化 (例: 1.46:644 -> 1:46.644)
    if (timeStr.includes('.') && timeStr.indexOf('.') < timeStr.indexOf(':')) {
      timeStr = timeStr.replace('.', ':');
      const lastColon = timeStr.lastIndexOf(':');
      if (lastColon !== -1) {
        timeStr = timeStr.substring(0, lastColon) + '.' + timeStr.substring(lastColon + 1);
      }
    }
  }

  // 4. 投稿回数の抽出
  const attMatch = text.match(/\[?投稿回数\]?\s*[:：]?\s*([^\n]+)/i);
  if (attMatch) {
    attemptText = attMatch[1].replace(/^：/, '').trim();
  }

  return { name, category, car, timeStr, attemptText };
}

async function getSheetsAuth() {
  const envPath = path.join(__dirname, '..', '.env.local');
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
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function getExistingUrls(sheets, spreadsheetId) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:A100`,
    });
    const rows = res.data.values;
    if (!rows) return new Set();
    return new Set(rows.map(row => (row[0] || '').trim().toLowerCase()));
  } catch (err) {
    console.error('[Error] Failed to read existing URLs:', err.message);
    return new Set();
  }
}

async function writeRowsToSheet(sheets, spreadsheetId, newEntries) {
  if (newEntries.length === 0) {
    console.log('[Sheets] No new entries to write.');
    return;
  }

  // 8列のフォーマット (URL, 本文, エントリー名, クラス, 車両, タイム(原文), 正規化タイム(ms), 投稿回数)
  const values = newEntries.map(e => [
    e.url,
    e.text,
    e.parsed.name,
    e.parsed.category,
    e.parsed.car,
    e.parsed.timeStr,
    e.parsed.timeStr, // 正規化タイム列にも標準化したタイムを直接書き込み
    e.parsed.attemptText
  ]);

  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    console.log(`[Sheets] Successfully appended ${newEntries.length} new complete entries to ${sheetName}.`);
  } catch (err) {
    console.error('[Error] Failed to append entries:', err.message);
  }
}

async function main() {
  const spreadsheetId = '1Ivkw-PybsyYmd-GZ9DPaUnhWYNDkG1QvL64NVNOwD_k';
  const sheets = await getSheetsAuth();

  if (!round) {
    console.log('[Config] Round was not specified. Auto-detecting latest round...');
    round = await getLatestRound(sheets, spreadsheetId);
  }
  
  if (!isTestMode) {
    sheetName = `Season3Rd${round}_TA`;
  }
  hashtag = `WECSSTARd${round}`;

  console.log(`[Config] Round: ${round}`);
  console.log(`[Config] Hashtag: #${hashtag}`);
  console.log(`[Config] Sheet Name: ${sheetName}`);
  console.log(`[Config] Test Mode: ${isTestMode}`);

  console.log('[Sheets] Checking existing URLs...');
  const existingUrls = await getExistingUrls(sheets, spreadsheetId);
  console.log(`[Sheets] Found ${existingUrls.size} existing URLs in sheet.`);

  // 自動収集用Chromeプロファイルパス
  const profilePath = path.join(__dirname, '..', 'scratch', 'chrome_profile');
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }

  console.log('[Playwright] Starting browser in headful mode to reuse session...');
  const context = await chromium.launchPersistentContext(profilePath, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    const searchUrl = `https://x.com/search?q=%23${hashtag}&f=live`;
    console.log(`[Browser] Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'load', timeout: 60000 });

    console.log('[Browser] Waiting for search results...');
    try {
      await page.waitForSelector('article', { timeout: 8000 });
    } catch (e) {
      console.log('\n=============================================================');
      console.log('【要確認】Xにログインしていないか、読み込みが遅れている可能性があります。');
      console.log('起動したChromeブラウザでXにログインしてください。');
      console.log('ログインが完了すると、自動的に検索結果が読み込まれスクリプトが再開します。');
      console.log('=============================================================\n');
      await page.waitForSelector('article', { timeout: 180000 });
    }

    console.log('[Browser] Scanned. Scrolling to load more tweets...');
    
    // ページ内のすべての投稿からURLと本文テキストをセットで取得する関数
    const extractTweets = async () => {
      return await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('article'));
        return articles.map(article => {
          const timeEl = article.querySelector('time');
          const aEl = timeEl ? timeEl.closest('a') : null;
          const url = aEl ? aEl.href : '';
          
          const textEl = article.querySelector('[data-testid="tweetText"]');
          const text = textEl ? textEl.innerText : '';
          
          return { url, text };
        }).filter(item => item.url && item.url.includes('/status/'));
      });
    };

    let allTweetData = [];
    allTweetData.push(...await extractTweets());

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(1500);
      allTweetData.push(...await extractTweets());
    }

    // URLで重複排除
    const tweetMap = new Map();
    allTweetData.forEach(item => {
       if (item.url) tweetMap.set(item.url, item);
    });
    const tweetData = Array.from(tweetMap.values());

    console.log(`[Browser] Scanned ${tweetData.length} tweets from X.`);

    // 重複を排除し、新規分のみ抽出
    const newEntriesMap = new Map();
    tweetData.forEach(item => {
      let cleanUrl = item.url.split('?')[0].trim().toLowerCase();
      cleanUrl = cleanUrl.replace('twitter.com', 'x.com');
      
      const match = cleanUrl.match(/https:\/\/x\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/);
      if (match) {
        const finalUrl = match[0];
        if (!existingUrls.has(finalUrl) && !newEntriesMap.has(finalUrl)) {
          // 本文を直接パース
          const parsed = parseTweetText(item.text);
          console.log("DEBUG PARSED:", finalUrl, parsed);
          // 必要なデータが最低限パースできている場合のみ追加
          if (parsed.name && parsed.timeStr) {
            newEntriesMap.set(finalUrl, {
              url: finalUrl,
              text: item.text,
              parsed
            });
          }
        }
      }
    });

    const newEntries = Array.from(newEntriesMap.values());
    console.log(`[Sync] Found ${newEntries.length} new complete entries to be added.`);
    if (newEntries.length > 0) {
      console.log(`[Sync] Sample parsed entry:`, JSON.stringify(newEntries[0], null, 2));
    }

    // スプレッドシートへの書き込み (8列すべてを書き込む)
    await writeRowsToSheet(sheets, spreadsheetId, newEntries);

  } catch (err) {
    console.error('[Error] Browser operations failed:', err);
  } finally {
    console.log('[Playwright] Closing browser...');
    await context.close();
  }
}

main();
