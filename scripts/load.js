const { extend } = require('umi-request');
const proxyAgent = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const compressing = require('compressing');

const request = extend({
  agent: new proxyAgent('http://127.0.0.1:7890'),
});

const load = async () => {
  const latest = await request.get('https://api.github.com/repos/EhTagTranslation/Database/releases/latest');
  const file = latest['assets'].find(o => o.name === 'db.text.json.gz');
  const data = await request.get(file.browser_download_url, {
    parseResponse: false,
  });
  const rawJsonPath = path.join(__dirname, '../src/db.raw.json');
  await compressing.gzip.uncompress(data.body, rawJsonPath);
  const rawJsonText = fs.readFileSync(rawJsonPath, 'utf-8');
  fs.writeFileSync(rawJsonPath, JSON.stringify(JSON.parse(rawJsonText), null, 2));
};

load();
