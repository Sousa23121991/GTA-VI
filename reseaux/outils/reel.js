// Génère un Reel vertical (1080x1920, MP4, sans musique) à partir d'un carrousel JSON.
// Usage : node reseaux/outils/reel.js reseaux/carrousels/2026-11-19.json
// Sortie : reseaux/reels/reel-<date>.mp4  (la musique s'ajoute dans l'appli Instagram)
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Schibsted+Grotesk:wght@500;700&display=swap');";
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outDir = path.join(__dirname, '..', 'reels');
fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reel-'));

// Zones sûres Reels : rien d'important dans les 250 px du haut ni les 420 px du bas.
const base = `*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;font-family:"Schibsted Grotesk",sans-serif;position:relative;overflow:hidden}`;
function cover(d) {
  return `<style>${FONTS}${base}body{background:#0b1830}
  .s{position:absolute;left:80px;top:330px;width:920px;height:1080px;background:#071126;border:16px solid #ffd060;border-radius:70px;box-shadow:18px 18px 0 #ff6b93;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 50px}
  .b{position:absolute;left:70px;right:70px;height:26px;background:radial-gradient(circle,#ffc233 45%,transparent 52%) 0 0/65px 26px repeat-x}
  .k{font-size:50px;color:#cfe0f0;font-weight:700}.t{font-family:Shrikhand;font-size:${d.title.length > 40 ? 96 : 124}px;line-height:1.05;margin:36px 0;color:#ffd060;text-shadow:0 0 .3em rgba(255,194,51,.6)}
  .f{position:absolute;left:0;right:0;top:1440px;text-align:center;font-family:Shrikhand;font-size:46px;color:#ffd0dc;text-shadow:0 0 .2em #ff6b93}</style>
  <div class="s"><div class="b" style="top:31px"></div><div class="b" style="bottom:31px"></div><div class="k">${esc(d.kicker || '')}</div><div class="t">${esc(d.title)}</div></div><div class="f">Compagnon GTA VI</div>`;
}
function slide(s, n, total) {
  return `<style>${FONTS}${base}body{background:#d6f0ec;color:#10294a;padding:300px 100px 0}
  .p{font-size:36px;font-weight:700;color:#46607c;margin-bottom:10px}.n{font-family:Shrikhand;font-size:300px;line-height:1;color:#e8456f}
  .t{font-family:Shrikhand;font-size:${s.title.length > 34 ? 92 : 112}px;line-height:1.06;margin:36px 0 44px}.d{font-size:54px;line-height:1.4;color:#46607c}</style>
  <div class="p">${n} / ${total}</div><div class="n">${n}</div><div class="t">${esc(s.title)}</div><div class="d">${esc(s.text)}</div>`;
}
function outro() {
  return `<style>${FONTS}${base}body{background:#0b1830;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 90px 300px}
  .t{font-family:Shrikhand;font-size:120px;line-height:1.08;color:#ffd0dc;text-shadow:0 0 .12em #ff6b93,0 0 .4em #ff6b93}.d{font-size:54px;color:#cfe0f0;margin-top:50px;line-height:1.4}</style>
  <div class="t">Abonne-toi</div><div class="d">Un post GTA VI par jour<br>Checklist gratuite : lien en bio</div>`;
}

(async () => {
  const pages = [cover(data), ...data.slides.map((s, i) => slide(s, i + 1, data.slides.length)), outro()];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const frames = [];
  for (let i = 0; i < pages.length; i++) {
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + pages[i] + '</body></html>');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const f = path.join(tmp, `f${i}.png`); await p.screenshot({ path: f }); frames.push(f);
  }
  await b.close();

  // Chaque image : léger zoom avant, puis fondu enchaîné vers la suivante.
  const D = 3.2, X = 0.4, FPS = 30;
  const args = ['-y'];
  frames.forEach(f => args.push('-i', f));
  const filters = frames.map((_, i) =>
    `[${i}:v]scale=1080:1920,zoompan=z='min(zoom+0.0006,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.round(D * FPS)}:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[v${i}]`);
  let last = 'v0', offset = D - X;
  for (let i = 1; i < frames.length; i++) {
    const out = i === frames.length - 1 ? 'vout' : `x${i}`;
    filters.push(`[${last}][v${i}]xfade=transition=fade:duration=${X}:offset=${offset.toFixed(2)}[${out}]`);
    last = out; offset += D - X;
  }
  const out = path.join(outDir, `reel-${data.date}.mp4`);
  args.push('-filter_complex', filters.join(';'), '-map', '[vout]', '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(out);
})().catch(e => { console.error(e); process.exit(1); });
