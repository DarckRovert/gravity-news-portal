const fs = require('fs');
const https = require('https');
const media = require('../src/data/media.json');

const liveQueries = {
  "nasa": "NASA ISS live stream",
  "dw": "DW News live",
  "skynews": "Sky News live"
};

async function searchYoutubeId(query) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgJAAQ%253D%253D`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find the first videoId
        const match = data.match(/"videoId":"([^"]{11})"/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  let changed = false;
  
  for (const v of media.live) {
    if (liveQueries[v.id]) {
      console.log(`Searching live replacement for: ${v.title}`);
      const newId = await searchYoutubeId(liveQueries[v.id]);
      if (newId) {
        console.log(`Found: ${newId}`);
        v.videoId = newId;
        v.channelId = null; // Remove channelId so it uses videoId
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync('./src/data/media.json', JSON.stringify(media, null, 2));
    console.log("Updated media.json");
  }
}
run();
