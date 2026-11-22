# Ronron — Un chaton à la fois

Une petite appli pour fumer moins, à son rythme. On note chaque cigarette d’un tap. Quand on fume un peu moins que son objectif, la chatte **Miette** grandit : Chaton → Chaton curieux → Chaton ado → Chat adulte → Chat d’élite → Chat légendaire.

- Marche sur iPhone (et Android) comme une vraie appli, **hors ligne**.
- **Aucune donnée ne part sur Internet** : tout reste sur le téléphone. Ce dépôt ne contient que le code, aucune donnée personnelle.
- Pas de compte, pas de pub, pas d’abonnement.

**Adresse de l’appli :** https://doberman75000-creator.github.io/ronron/

---

## 1. Installer Ronron sur l’iPhone (à faire une seule fois)

> ⚠️ Sur iPhone, l’appli installée sur l’écran d’accueil et Safari ont des données **séparées**. Il faut donc installer d’abord, puis commencer **depuis l’icône**.

1. Sur l’iPhone, ouvrir le lien ci-dessus **dans Safari** (pas dans Chrome ni dans l’aperçu d’un message).
2. Toucher le bouton **Partager** (le carré avec une flèche vers le haut).
3. Descendre et choisir **Sur l’écran d’accueil**, laisser **Ouvrir en tant qu’app web** activé, puis **Ajouter**.
4. Fermer Safari et ouvrir **Ronron depuis la nouvelle icône**.

### Reprendre l’historique Smoless (61 jours)

1. Envoyer le fichier `ronron-historique.json` sur l’iPhone (AirDrop, Messages, WhatsApp ou mail), puis le **garder dans l’app Fichiers** (sur le fichier : Partager → Enregistrer dans Fichiers).
2. Dans Ronron (ouvert depuis l’icône) : **Reprendre mon historique** → choisir le fichier.
3. Si des jours manquent entre la vidéo Smoless et l’installation, un bandeau le signale : **Historique → Corriger un jour** pour les renseigner.

Sinon, **Commencer de zéro** : on indique combien de cigarettes par jour aujourd’hui, le prix du paquet, et c’est parti.

---

## 2. Au quotidien

| Je veux… | Où |
|---|---|
| Noter une cigarette | Accueil → gros bouton patte (un 2e tap en moins d’une seconde est ignoré) |
| Corriger une erreur | Accueil → « Annuler la dernière », ou Historique → Corriger un jour |
| Faire le bilan du soir et caresser Miette | Accueil → icône lune |
| Valider un palier | Quand la moyenne des 3 derniers jours passe sous l’objectif, un bandeau doré apparaît. C’est elle qui accepte ou attend. |
| Quêtes et badges | Onglet Quêtes |
| Habiller Miette, ouvrir un cadeau surprise | Onglet Boutique (22 articles d’hiver, 5 raretés, un article par emplacement) |
| Super Chacha de Noël | Porter les 5 pièces légendaires de Noël : Miette se transforme en Mère Noël |
| Changer l’objectif, le prix, le nom du chaton, le son | Onglet Réglages |

**Rappel du soir :** une web app ne peut pas programmer de notification toute seule sur iPhone. On passe par l’app **Raccourcis** → Automatisation → **+** → Heure de la journée (22:30, quotidiennement, exécuter immédiatement) → action **Ouvrir l’app** → Ronron.

**Les sons** suivent l’interrupteur silencieux de l’iPhone (pas de miaou en réunion).

---

## 3. Sauvegarder (important)

Les données vivent dans l’appli. **Si on supprime l’icône Ronron, elles disparaissent.**

- Réglages → **Sauvegarder mes données** → **Enregistrer dans Fichiers** (idéalement dans iCloud Drive).
- L’appli rappelle de le faire si la dernière sauvegarde a plus de 14 jours.
- Pour récupérer (nouvel iPhone, icône supprimée) : réinstaller (étape 1), puis **Reprendre mon historique** avec le fichier `ronron-sauvegarde-AAAA-MM-JJ.json`.

---

## 4. Faire une mise à jour (côté Etienne)

Le site est publié automatiquement par **GitHub Pages** depuis la branche `main`. Une mise à jour = modifier les fichiers puis pousser sur `main`.

### Étapes

1. Modifier le code (ou demander à Claude de le faire et de pousser).
2. **Augmenter le numéro de version à deux endroits** (sinon l’iPhone garde l’ancienne version en cache) :
   - `sw.js`, ligne 3 : `const VERSION = '1.0.1';`
   - `js/app.js`, ligne 5 : `export const VERSION_APP = '1.0.1';`
3. Pousser sur `main` :
   ```bash
   git add -A
   git commit -m "Ronron 1.0.1 : <ce qui change>"
   git push
   ```
   Sans terminal : sur github.com, ouvrir le fichier → crayon ✏️ → modifier → **Commit changes**.
4. Attendre 1 à 2 minutes : l’onglet **Actions** du dépôt passe au vert (« pages build and deployment »).

### Ce qui se passe sur l’iPhone

- À la prochaine ouverture de Ronron, un bandeau **« Une nouvelle version de Ronron est prête »** apparaît → **Mettre à jour**. L’appli se recharge, **les données sont conservées**.
- Si le bandeau ne vient pas : fermer complètement Ronron (balayer vers le haut dans le sélecteur d’apps) et la rouvrir, deux fois si besoin.

### Règles à respecter pour ne rien casser

- Ne jamais renommer la clé de stockage `ronron:v1` dans `js/donnees.js` : ce serait repartir de zéro.
- Si on ajoute un fichier (image, script…), l’ajouter aussi dans la liste `FICHIERS` de `sw.js`, sinon il ne marchera pas hors ligne.
- Ne jamais mettre de données personnelles (fichiers `.json` d’historique ou de sauvegarde) dans ce dépôt : il est public.

---

## 5. Tester sur un ordinateur

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Organisation du code

```
index.html            page unique
manifest.webmanifest  nom, icônes, couleurs de l’appli installée
sw.js                 cache hors ligne + mises à jour
css/app.css           apparence
js/app.js             écrans et actions
js/donnees.js         stockage local, calculs (stades, croquettes, badges, paliers)
js/chat.js            dessin de Miette (SVG)
js/sons.js            miaous et ronrons synthétisés
fonts/                Fredoka et Nunito (licence SIL OFL)
```

---

Ronron n’est pas un dispositif médical. Pour un vrai coup de main : **Tabac Info Service, 39 89** (gratuit).
