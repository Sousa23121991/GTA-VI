// Génère un carrousel Instagram (1080x1350) à partir d'un fichier JSON.
// Usage : node reseaux/outils/carrousel.js reseaux/carrousels/2026-11-19.json
// JSON : { "date": "2026-11-19", "kicker": "JOUR J", "title": "…", "cta": "Glisse →",
//          "slides": [ { "title": "…", "text": "…" }, … ] }   (4 à 6 slides conseillées)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Schibsted+Grotesk:wght@500;700&display=swap');";
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = path.join(__dirname, '..', 'images');

function cover(d) {
  return `<style>${FONTS}*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#d6f0ec;font-family:"Schibsted Grotesk",sans-serif;position:relative}
  .s{position:absolute;left:80px;top:150px;width:920px;height:1000px;background:#071126;border:16px solid #ffd060;border-radius:70px;box-shadow:18px 18px 0 #ff6b93;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 50px}
  .b{position:absolute;left:70px;right:70px;height:26px;background:radial-gradient(circle,#ffc233 45%,transparent 52%) 0 0/65px 26px repeat-x}
  .k{font-size:48px;color:#cfe0f0;font-weight:700}.t{font-family:Shrikhand;font-size:${d.title.length > 40 ? 92 : 118}px;line-height:1.05;margin:30px 0;color:#ffd060;text-shadow:0 0 .3em rgba(255,194,51,.6)}
  .c{font-size:40px;color:#cfe0f0}.f{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-family:Shrikhand;font-size:44px;color:#10294a}</style>
  <div class="s"><div class="b" style="top:31px"></div><div class="b" style="bottom:31px"></div><div class="k">${esc(d.kicker || '')}</div><div class="t">${esc(d.title)}</div><div class="c">${esc(d.cta || 'Glisse →')}</div></div><div class="f">Compagnon GTA VI</div>`;
}
function slide(s, n, last) {
  return `<style>${FONTS}*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#d6f0ec;color:#10294a;font-family:"Schibsted Grotesk",sans-serif;padding:110px 100px;position:relative}
  .n{font-family:Shrikhand;font-size:260px;line-height:1;color:#e8456f}.t{font-family:Shrikhand;font-size:${s.title.length > 34 ? 80 : 96}px;line-height:1.08;margin:30px 0 40px}.d{font-size:46px;line-height:1.4;color:#46607c}
  .f{position:absolute;left:100px;right:100px;bottom:90px;display:flex;justify-content:space-between;font-size:34px;font-weight:700;border-top:4px solid #10294a;padding-top:28px}</style>
  <div class="n">${n}</div><div class="t">${esc(s.title)}</div><div class="d">${esc(s.text)}</div><div class="f"><span>Compagnon GTA VI</span><span>${last ? 'Lien en bio' : 'Glisse →'}</span></div>`;
}
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [cover(data), ...data.slides.map((s, i) => slide(s, i + 1, i === data.slides.length - 1))];
  for (let i = 0; i < pages.length; i++) {
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + pages[i] + '</body></html>');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const f = path.join(out, `carrousel-${data.date}-${i + 1}.png`);
    await p.screenshot({ path: f }); console.log(f);
  }
  await b.close();
})();
