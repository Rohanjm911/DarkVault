const path = require('path');
const http = require('http');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '..', 'frontend', 'node_modules', 'puppeteer-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve(__dirname, '..', 'frontend', 'dist');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
};

function startStaticServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(DIST_DIR, req.url.split('?')[0]);
      if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        } else {
          filePath = path.join(DIST_DIR, 'index.html');
        }
      }

      if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });

    server.listen(port, () => {
      console.log(`Static preview server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const server = await startStaticServer(4173);

  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
  await sleep(2000);

  const tabs = [
    { id: 'dashboard', name: '01-dashboard.png', label: 'Command Dashboard' },
    { id: 'analyzer', name: '02-password-analyzer.png', label: 'Password Analyzer' },
    { id: 'breach', name: '03-breach-checker.png', label: 'Breach Range Checker' },
    { id: 'generator', name: '04-key-generator.png', label: 'Key Generator' },
    { id: 'audit', name: '05-security-audit.png', label: 'Security Audit' },
    { id: 'reports', name: '06-executive-reports.png', label: 'Executive Reports' },
  ];

  for (const tab of tabs) {
    console.log(`Capturing: ${tab.label}...`);
    // Click button with text matching tab.label in nav
    const buttons = await page.$$('nav button');
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text.includes(tab.label)) {
        await btn.click();
        break;
      }
    }

    await sleep(1500);

    const outPath = path.join(OUTPUT_DIR, tab.name);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`Saved screenshot to: ${outPath}`);
  }

  await browser.close();
  server.close();
  console.log('All real UI screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
