const { extend } = require('umi-request');
const proxyAgent = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');

const request = extend({
  agent: new proxyAgent('http://127.0.0.1:7890'),
});

const load = async () => {
  const latest = await request.get('https://api.github.com/repos/EhTagTranslation/Database/releases/latest');
  const file = latest['assets'].find(o => o.name === 'db.raw.json');
  const data = await request.get(file.browser_download_url, {});
  fs.writeFileSync(path.join(__dirname, '../src/db.raw.json'), JSON.stringify(data, null, 2));
};

load();
