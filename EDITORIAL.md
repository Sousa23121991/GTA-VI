# Ligne éditoriale : Compagnon GTA VI

Ce fichier guide la publication quotidienne (humaine ou automatique).

## Ce qui est publié chaque jour

1. **Un article** ajouté en tête du tableau `POSTS` dans `site/index.html`.
2. **Un fichier `contenu/AAAA-MM-JJ.md`** avec l'article résumé, ses sources et les posts réseaux :
   X/Threads (2-3 posts), Instagram (carrousel + légende + hashtags), TikTok/Reels/Shorts (script 30 s), Story.
3. **La mise à jour du site publié** (l'artifact) avec le nouveau `site/index.html`.

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
