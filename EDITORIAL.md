# Ligne éditoriale : Compagnon GTA VI

Ce fichier guide la publication quotidienne (humaine ou automatique).

## Ce qui est publié chaque jour

1. **Un article** ajouté en tête du tableau `POSTS` dans `site/index.html`.
2. **Un fichier `contenu/AAAA-MM-JJ.md`** avec l'article résumé, ses sources et les posts réseaux :
   X/Threads (2-3 posts), Instagram (carrousel + légende + hashtags), TikTok/Reels/Shorts (script 30 s), Story.
3. **Le carrousel Instagram en images** : écrire `reseaux/carrousels/AAAA-MM-JJ.json` puis lancer
   `node reseaux/outils/carrousel.js reseaux/carrousels/AAAA-MM-JJ.json` (images dans `reseaux/images/`).
   Le JSON contient aussi `caption` : la légende Instagram complète (2200 caractères max, hashtags inclus).
4. **Le Reel sans musique** : `node reseaux/outils/reel.js reseaux/carrousels/AAAA-MM-JJ.json` → `reseaux/reels/reel-AAAA-MM-JJ.mp4`
   (non versionné), envoyé à l'utilisateur qui le publie depuis l'appli en ajoutant un son tendance.
5. **La mise à jour du site publié** (l'artifact) avec le nouveau `site/index.html`.

## Règles

- **Français, tutoiement**, ton complice et clair. Phrases courtes.
- **Aucun fait inventé.** Chaque info d'actu (dates, tailles, patchs, contenus du jeu, prix) vient d'une recherche web
  du jour et est citée dans `sources`. Si une info n'est pas confirmée, ne pas la publier ou écrire « non confirmé ».
- Pas de spoilers de l'histoire sans prévenir dans le titre (« [Spoilers] »).
- Pas de fuites, pas de cheats ni d'exploits en ligne qui enfreignent les règles de Rockstar.
- Pas d'images officielles copiées : le site reste texte + design maison.
- Site non officiel : ne jamais imiter la communication de Rockstar.
- Si un article remplit un guide prévu (Bien débuter, Argent et progression, Cartes et lieux, Performances et réglages),
  mettre `href: "#post-<id>"` sur ce guide dans `CONFIG.guides`.
- Mettre à jour la date du pied de page (`id="verified"`).
- Garder au maximum ~30 articles dans `POSTS` ; les plus anciens restent dans `contenu/`.

## Rotation des thèmes (semaine type après la sortie)

| Jour | Thème |
|---|---|
| Lundi | Guide pratique (progression, argent, réglages) |
| Mardi | Actus de la semaine (patchs, annonces, événements) |
| Mercredi | Lieux et exploration de Leonida |
| Jeudi | Astuces rapides (top 5 / top 10) |
| Vendredi | Ce que dit la communauté (découvertes vérifiées) |
| Samedi | Défi du week-end à suivre avec les compteurs du site |
| Dimanche | Récap de la semaine |

Une grosse actu (patch, annonce officielle) passe toujours avant le thème prévu.

## Format d'un article dans `POSTS`

```js
{
  id: "2026-11-19-jour-de-sortie",
  date: "2026-11-19",
  tag: "Jour J",               // court : Actu, Guide, Astuces, Récap…
  title: "…",
  summary: "Une ou deux phrases.",
  body: [ { h: "Intertitre" }, { p: "Paragraphe." }, { ul: ["point", "point"] } ],
  sources: [ { label: "Média : sujet", href: "https://…" } ]
}
```

## Planning : semaine de lancement (19-24 novembre 2026)

Sujets prévus ; une grosse actu passe toujours devant. Aucun fait inventé : chaque info vient des recherches du jour.

| Date | Thème | Sujet prévu |
|---|---|---|
| Jeu 19 | Jour J | « C'est sorti » : ce qu'il faut savoir pour lancer sa partie (mise à jour du jour J, heure de dispo, premiers réglages conseillés) |
| Ven 20 | Communauté | Premiers problèmes signalés et solutions vérifiées (serveurs, bugs, performances), premières découvertes confirmées |
| Sam 21 | Défi du week-end | Défi à suivre avec les compteurs du site + astuces rapides des premières heures |
| Dim 22 | Récap | Récap de la semaine de lancement : chiffres officiels, patchs, meilleures astuces |
| Lun 23 | Guide | Guide « Bien débuter » (remplit le guide prévu sur le site) |
| Mar 24 | Actus | Actus de la semaine : patchs, annonces Rockstar |
