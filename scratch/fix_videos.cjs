const fs = require('fs');
const https = require('https');
const media = require('../src/data/media.json');

const deadVideos = [
  "aOjaEOgMv4M", "HAPifiEQflE", "FtPhpC6ZVj8", "n4jA8jO6P-U", "3d9i_0Tx7A", "T8BqTqM_hkk", "eK1wL1xT9XQ", "p2MEffQvEvk",
  "tEHWZvGEt7M", "5iONN9n6sZ0", "Qam5BkXIGYA", "fAIV12o4s10", "mrKXq_B1h_Y", "e4_n7-22HhE", "csE9HvxHlWQ", "uPzJk0IerP8"
];

const fallbackIds = ["j_R9kCqxYxY", "3p9DLD_rbm0", "j800SVeiS5I", "bS5P_LAqiVg", "YJg02ivYzSs", "9vz06QO3UkQ", "7Pq-S557XQU", "XEVlyP4_11M"];

async function searchYoutubeId(title) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(title);
    https.get(`https://www.youtube.com/results?search_query=${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
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
  let fallbackIndex = 0;
  
  for (const category of ['cinema', 'docs']) {
    for (const v of media[category]) {
      if (deadVideos.includes(v.videoId)) {
        console.log(`Searching replacement for: ${v.title}`);
        const newId = await searchYoutubeId(v.title);
        if (newId) {
          console.log(`Found: ${newId}`);
          v.videoId = newId;
        } else {
          v.videoId = fallbackIds[fallbackIndex % fallbackIds.length];
          fallbackIndex++;
          console.log(`Using fallback for: ${v.title} -> ${v.videoId}`);
        }
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
