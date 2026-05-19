const https = require('https');

async function searchPexels(q) {
  return new Promise((resolve) => {
    https.get('https://www.pexels.com/search/' + encodeURIComponent(q) + '/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/src="([^"]+images\.pexels\.com\/photos\/[0-9]+\/pexels-photo-[0-9]+\.jpeg[^"]+)"/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const queries = [
  'person looking out window',
  'eye drops',
  'computer desk',
  'phone in dark',
  'healthy food plate',
  'glass of water',
  'cigarette smoke',
  'sunglasses beach',
  'contact lens',
  'eye makeup',
  'blurry vision',
  'eye test',
  'optometrist',
  'carrots',
  'reading book lamp'
];

async function run() {
  for (let q of queries) {
    const url = await searchPexels(q);
    console.log(q + ' -> ' + url);
  }
}
run();
