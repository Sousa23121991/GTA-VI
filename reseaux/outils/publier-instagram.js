// Publie le carrousel du jour sur Instagram via l'API officielle (API Instagram, connexion unifiée Meta).
//
// Usage :
//   node reseaux/outils/publier-instagram.js 2026-11-19            -> vérification seulement (rien n'est publié)
//   node reseaux/outils/publier-instagram.js 2026-11-19 --publier  -> publie réellement
//
// Variables d'environnement :
//   IG_ACCESS_TOKEN  jeton d'accès (utilisateur système), jamais dans le dépôt ni dans le chat
//   IG_USER_ID       identifiant du compte Instagram (Paramètres business → Comptes Instagram)
//   IMAGE_BASE_URL   adresse publique où sont servies les images de reseaux/images/
//                    ex. https://sousa23121991.github.io/GTA-VI/reseaux/images
//   IG_API_VERSION   facultatif, défaut v21.0
//   IG_API_HOST      facultatif, défaut graph.facebook.com (graph.instagram.com pour l'ancienne connexion Instagram)
//
// Le texte du post vient du champ "caption" de reseaux/carrousels/<date>.json.
const fs = require('fs');
const path = require('path');

const date = process.argv[2];
const publish = process.argv.includes('--publier');
if (!/^[a-z0-9-]+$/.test(date || '')) { console.error('Donne une date AAAA-MM-JJ.'); process.exit(1); }

const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'carrousels', date + '.json'), 'utf8'));
const files = fs.readdirSync(path.join(root, 'images'))
  .filter(f => f.startsWith(`carrousel-${date}-`) && f.endsWith('.png'))
  .sort((a, b) => parseInt(a.split('-').pop()) - parseInt(b.split('-').pop()));

const token = process.env.IG_ACCESS_TOKEN;
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'instagram.json'), 'utf8'));
const base = (process.env.IMAGE_BASE_URL || cfg.imageBaseUrl || '').replace(/\/$/, '');
const API = `https://${process.env.IG_API_HOST || 'graph.facebook.com'}/${process.env.IG_API_VERSION || 'v21.0'}`;
const userId = process.env.IG_USER_ID || cfg.userId;

const problems = [];
if (files.length < 2 || files.length > 10) problems.push(`Il faut 2 à 10 images, trouvé ${files.length}.`);
if (!data.caption) problems.push('Champ "caption" manquant dans le JSON.');
else if (data.caption.length > 2200) problems.push('Légende trop longue (2200 caractères max).');
if ((data.caption || '').includes('[LIEN DU SITE]')) problems.push('La légende contient encore [LIEN DU SITE].');
if (!token) problems.push('IG_ACCESS_TOKEN absent.');
if (!base) problems.push('IMAGE_BASE_URL absent.');
if (!userId) problems.push('IG_USER_ID absent.');

console.log(`Carrousel ${date} : ${files.length} images`);
files.forEach(f => console.log('  ' + (base ? base + '/' : '') + f));
console.log('\nLégende :\n' + (data.caption || '(vide)') + '\n');
if (problems.length) { console.error('À corriger :\n- ' + problems.join('\n- ')); process.exit(1); }

async function api(method, p, params) {
  const url = new URL(API + p);
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = method === 'GET'
    ? await fetch(url + '?' + body)
    : await fetch(url, { method, body });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`${p} : ${JSON.stringify(json.error || json)}`);
  return json;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitReady(id) {
  for (let i = 0; i < 20; i++) {
    const s = await api('GET', `/${id}`, { fields: 'status_code' });
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`Conteneur ${id} : ${s.status_code}`);
    await sleep(3000);
  }
  throw new Error(`Conteneur ${id} pas prêt après 60 s`);
}

(async () => {
  for (const f of files) {
    let r;
    try { r = await fetch(`${base}/${f}`, { method: 'HEAD' }); }
    catch (e) { console.warn(`(Impossible de vérifier ${f} depuis cette session : réseau. Instagram le vérifiera.)`); break; }
    if (!r.ok) throw new Error(`Image non accessible publiquement (${r.status}) : ${base}/${f}`);
  }
  const me = await api('GET', `/${userId}`, { fields: 'username' });
  me.user_id = userId;
  console.log(`Compte : @${me.username}`);
  if (!publish) { console.log('\nVérification OK. Rien publié. Ajoute --publier pour publier.'); return; }

  const children = [];
  for (const f of files) {
    const c = await api('POST', `/${me.user_id}/media`, { image_url: `${base}/${f}`, is_carousel_item: 'true' });
    children.push(c.id);
  }
  for (const id of children) await waitReady(id);
  const carousel = await api('POST', `/${me.user_id}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption: data.caption });
  await waitReady(carousel.id);
  const post = await api('POST', `/${me.user_id}/media_publish`, { creation_id: carousel.id });
  const info = await api('GET', `/${post.id}`, { fields: 'permalink' });
  console.log(`Publié : ${info.permalink}`);
})().catch(e => { console.error('Échec : ' + e.message); process.exit(1); });
