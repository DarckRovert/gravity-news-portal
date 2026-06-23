const fs = require('fs');
const media = require('../src/data/media.json');
const https = require('https');

async function checkVideo(id, title) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, (res) => {
      if (res.statusCode !== 200) {
        console.log(`DEAD: ${title} (${id}) - Status: ${res.statusCode}`);
      } else {
        console.log(`ALIVE: ${title} (${id})`);
      }
      resolve();
    }).on('error', (e) => {
      console.log(`ERROR: ${title} (${id}) - ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  const all = [...media.cinema, ...media.docs];
  for (const v of all) {
    if (v.videoId) {
      await checkVideo(v.videoId, v.title);
    }
  }
}
run();
