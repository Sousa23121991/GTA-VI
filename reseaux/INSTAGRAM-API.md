# Publier automatiquement sur Instagram (@compagnongtavi)

On utilise l'**API Instagram officielle avec connexion Instagram**. Elle ne demande **pas de page Facebook**.
Il faut un compte développeur Meta (gratuit) et environ 20 minutes.

Ne colle **jamais** le jeton ni un mot de passe dans le chat ou dans le dépôt.

---

## Étape 0 : prérequis (sur l'appli Instagram)

- [ ] Nouveau mot de passe fort + double authentification activée
- [ ] Compte passé en **professionnel → Créateur** (Paramètres → Type de compte et outils)

## Étape 1 : compte développeur Meta

1. Va sur **developers.facebook.com** et connecte-toi avec un compte Facebook (le tien suffit, il ne sera pas lié au compte Instagram).
2. Clique **Commencer** et termine l'inscription développeur (vérification par email ou téléphone).

## Étape 2 : créer l'app

1. **Mes apps → Créer une app**.
2. Nom : `Compagnon GTA VI Publication`. Email de contact : le tien.
3. Cas d'utilisation : **« Gérer les messages et le contenu sur Instagram »** (Instagram API).
4. Si on te le demande, type d'app : **Entreprise**. Ne relie aucun portefeuille business.
5. Crée l'app. Laisse-la en **mode Développement** : c'est suffisant pour publier sur ton propre compte,
   sans validation de Meta.

## Étape 3 : relier @compagnongtavi et générer le jeton

1. Dans le tableau de bord de l'app : **Instagram → Configuration de l'API avec connexion Instagram**.
2. Section **« Générer des jetons d'accès »** → **Ajouter un compte** → connecte-toi à **@compagnongtavi**
   et accepte les autorisations.
   - Si Meta indique que le compte doit être testeur : dans l'appli Instagram, va dans
     Paramètres → Applications et sites web → **Invitations de testeur** et accepte, puis recommence.
3. Vérifie que les autorisations incluent **`instagram_business_basic`** et **`instagram_business_content_publish`**.
4. Clique **Générer un jeton** et copie-le **directement** à l'étape 5 (pas dans le chat).

Le jeton dure **60 jours**. Mets un rappel à 50 jours pour en générer un nouveau de la même façon.

## Étape 4 : rendre les images accessibles publiquement

Instagram télécharge les images depuis une adresse web publique. Aujourd'hui le dépôt GitHub est **privé**,
donc Instagram ne peut pas les lire.

**Solution conseillée :** rendre le dépôt public et activer **GitHub Pages**. Ça règle aussi le lien en bio, car
le site devient public en même temps. Le dépôt ne contient que le site, les textes et les images : aucun secret.

1. GitHub → dépôt **GTA-VI** → **Settings → General → Danger Zone → Change visibility → Public**.
2. **Settings → Pages** → Source : *Deploy from a branch* → branche `claude/daily-content-publications-6o3ny8`,
   dossier `/ (root)` → Save.
3. Après 1 à 2 minutes :
   - site : `https://sousa23121991.github.io/GTA-VI/site/`
   - images : `https://sousa23121991.github.io/GTA-VI/reseaux/images/`

## Étape 5 : donner l'accès à Claude (dans les réglages de l'environnement, pas dans le chat)

Dans Claude Code : menu de l'environnement cloud (barre de titre de la session) → **Edit**.

1. **Accès réseau** : ajoute **`graph.instagram.com`** dans les domaines autorisés
   (laisse la case des gestionnaires de paquets cochée).
2. **Variables d'environnement** :
   ```
   IG_ACCESS_TOKEN=<le jeton de l'étape 3>
   IMAGE_BASE_URL=https://sousa23121991.github.io/GTA-VI/reseaux/images
   ```
3. Enregistre. Les nouvelles sessions (dont la tâche de chaque matin) en profiteront.

## Étape 6 : test

Dans une nouvelle session, demande : « Vérifie la publication Instagram du jour ». Claude lance :

```
node reseaux/outils/publier-instagram.js AAAA-MM-JJ             # vérifie, ne publie rien
node reseaux/outils/publier-instagram.js AAAA-MM-JJ --publier   # publie
```

**Première semaine :** la tâche du matin prépare et vérifie le post, puis attend ton « ok » pour publier.
Ensuite, si tout te plaît, on passe en publication automatique.

## Limites de l'API

- Carrousels, photos et Reels : oui. **Stories : non** (à poster à la main).
- Musique Instagram et sondages : non, à faire dans l'appli.
- Maximum 50 publications par 24 h, largement suffisant.
