# Publier automatiquement sur Instagram (@compagnon_gta_vi)

Méthode actuelle de Meta pour les nouvelles apps : **API Instagram avec connexion unifiée** (« Unified login »),
avec un **jeton d'utilisateur système** qui **n'expire pas**.

Ne colle **jamais** le jeton ni un mot de passe dans le chat ou dans le dépôt.

---

## Étape 0 : prérequis (appli Instagram)

- [ ] Mot de passe fort + double authentification
- [ ] Compte **professionnel → Créateur**, et public

## Étape 1 : app Meta (fait)

developers.facebook.com → Mes apps → app créée avec le cas d'utilisation Instagram.

## Étape 2 : portefeuille business (fait)

Portefeuille « Compagnon GTA VI » associé à l'app (obligatoire pour la connexion unifiée). Gratuit, aucune
vérification d'entreprise nécessaire pour publier sur ton propre compte.

## Étape 3 : créer la configuration et le jeton

Dans l'app : **Cas d'utilisation → Personnaliser → API setup with Unified login**.

1. **1. Configurez votre application → Créer une nouvelle configuration.**
   - Nom : `Publication`
   - Type de jeton : **Token d'accès utilisateur système (SUAT)**, expiration **Jamais**
   - Éléments : **compte Instagram @compagnon_gta_vi** (si Meta demande de l'ajouter au portefeuille, accepte).
     Compte publicitaire : aucun.
   - Autorisations : garde au minimum **`instagram_basic`** et **`instagram_content_publish`**.
     Si tu peux décocher les autres (`ads_*`, `instagram_manage_messages`, `instagram_manage_comments`), décoche-les :
     moins d'accès = moins de risques.
2. L'**URL de redirection** n'est pas nécessaire pour nous : laisse vide.
3. Continue l'assistant jusqu'à **Générer le jeton**. Copie-le directement dans les réglages (étape 5).
   - Si tu le perds ou s'il fuite : business.facebook.com → **Paramètres → Utilisateurs système** → révoquer et régénérer.

## Étape 4 : identifiant du compte Instagram

business.facebook.com → **Paramètres** → **Comptes → Comptes Instagram** → clique sur @compagnon_gta_vi :
l'**identifiant** (une suite de chiffres) est affiché. Ce n'est pas un secret.

## Étape 5 : images publiques

Le dépôt GitHub est privé : Instagram ne peut pas lire les images.

1. GitHub → dépôt **GTA-VI** → **Settings → General → Danger Zone → Change visibility → Public**.
2. **Settings → Pages** → *Deploy from a branch* → `claude/daily-content-publications-6o3ny8`, dossier `/ (root)` → Save.
3. Après 1 à 2 minutes :
   - site : `https://sousa23121991.github.io/GTA-VI/site/`
   - images : `https://sousa23121991.github.io/GTA-VI/reseaux/images/`

## Étape 6 : donner l'accès à Claude (réglages de l'environnement, pas le chat)

Claude Code → menu de l'environnement cloud (barre de titre) → **Edit** :

1. **Accès réseau** : ajoute **`graph.facebook.com`** aux domaines autorisés (laisse cochés les gestionnaires de paquets).
2. **Variables d'environnement** :
   ```
   IG_ACCESS_TOKEN=<jeton de l'étape 3>
   ```
   L'identifiant du compte et l'adresse des images ne sont pas secrets : ils sont dans `reseaux/instagram.json`.
3. Enregistre. Les nouvelles sessions (dont la tâche de chaque matin) en profitent.

## Étape 7 : test

```
node reseaux/outils/publier-instagram.js AAAA-MM-JJ             # vérifie, ne publie rien
node reseaux/outils/publier-instagram.js AAAA-MM-JJ --publier   # publie
```

Première semaine : la tâche du matin vérifie le post puis attend ton « ok » avant de publier.

## Limites de l'API

- Carrousels, photos et Reels : oui. **Stories : non** (à la main).
- Musique Instagram et sondages : non, dans l'appli.
- Maximum 50 publications par 24 h.
