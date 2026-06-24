const fs = require('fs');
const path = require('path');

const docs = {
  "la-voluntad-soberana.html": "17kUPrfLZAJc8F5Nj54co4BUO_GZMspo3CNZXnRBFop0",
  "la-voluntad-soberana-v2.html": "1m100z31Jd0Jt7QXobT0r9Vf6RX18GVS1tjAPF7O0HkM",
  "la-voluntad-soberana-v3.html": "1w2e41VU7HqL2ceorStoDBhIcFl0vfRU17DA4EnQx7Fc",
  "cenizas-del-leviatan-libro-1.html": "1asgUmyv5Oi0A7Jo7Gf3aI0i7jA89I7NnVt6iyR7lSOY",
  "cenizas-del-leviatan-libro-2.html": "13Kh1SoTLusUcNoQsOK6Yp50Csi_jgkxsL58ttUv34W8",
  "cenizas-del-leviatan-libro-3.html": "1T-v7_ckXUm0aedzRDif2RowgoAL98yMB11dnkFLK9Ok",
  "convergencia-entropica.html": "1AwjzomHXzLUDBr0E-RHnmZacFvT5HHDkhtp5SuXWkNI",
  "el-cero-operativo.html": "1aToUYBLIctv-y6qJHqsvEQOi_WCTbnBp6BJwp_DnTaY",
  "el-sustrato-primordial.html": "10rlcBTNPTWB5khfdwUzFmER3hsPDvJlY66s16WB04z8",
  "la-arquitectura-de-la-fuga.html": "1DcgpkixK8RLlwhVhOcdxVlj9bN_fZEgQgVNiP1Nyn5U",
  "la-f-sica-del-poder.html": "1Zh9gt79H50Yd3sgx3BZIYoYxrBLFwn9GlM_4PKLZ1n0",
  "la-fractura-del-espejo.html": "1ka3Yd_sQEkTNCAMbXkc0Lcoe8Xmip9ABS-rMStyVa6g"
};

const outputDir = path.join(__dirname, '../public/books');

async function downloadDocs() {
  for (const [filename, id] of Object.entries(docs)) {
    console.log(`Downloading ${filename}...`);
    const exportUrl = `https://docs.google.com/document/d/${id}/export?format=html`;
    try {
      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      fs.writeFileSync(path.join(outputDir, filename), html);
      console.log(`Saved ${filename} (${html.length} bytes)`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, e);
    }
  }
}

downloadDocs();
