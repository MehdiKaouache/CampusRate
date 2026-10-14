# CampusRate

## 1. Description du projet

CampusRate est une API REST permettant à la communauté étudiante de consulter des endroits ou services du campus et de publier des appréciations accompagnées d'une note. Le projet est réalisé individuellement dans le cadre du cours 420-514 - Collecte et interprétation des données (Automne 2026).

- **TP1** : conception du contrat HTTP, avec persistance dans un fichier JSON.
- **TP2** : remplacement de la persistance JSON par MongoDB, validation systématique des entrées, renforcement de la sécurité et de la configuration. Le contrat HTTP du TP1 est conservé : mêmes URI, mêmes méthodes, mêmes formats de réponse.

## 2. Fonctionnalités

- Créer, consulter, modifier partiellement et supprimer un endroit (`place`).
- Créer, consulter, modifier partiellement et supprimer une appréciation (`review`) associée à un endroit.
- Filtrer les endroits par catégorie et les paginer.
- Calcul automatique de la note moyenne et du nombre d'appréciations d'un endroit à chaque création, modification ou suppression d'appréciation.
- Persistance dans MongoDB (Atlas), conservée après un redémarrage.
- Validation stricte des entrées : types, longueurs, valeurs autorisées, propriétés inconnues refusées.
- Gestion uniforme des erreurs au format Problem Details (`application/problem+json`).
- CORS configuré par liste d'origines, en-têtes de sécurité avec Helmet.
- Documentation interactive avec Swagger UI.

## 3. Technologies utilisées

- [NestJS](https://nestjs.com/) et TypeScript
- [MongoDB](https://www.mongodb.com/) (Atlas) avec [Mongoose](https://mongoosejs.com/) et `@nestjs/mongoose`
- [class-validator](https://github.com/typestack/class-validator) et [class-transformer](https://github.com/typestack/class-transformer)
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) et [Joi](https://joi.dev/)
- [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
- [Helmet](https://helmetjs.github.io/)
- Postman pour les essais manuels

## 4. Prérequis

- [Node.js](https://nodejs.org/) v22.12 ou plus récent
- npm (installé avec Node.js)
- Un compte [MongoDB Atlas](https://www.mongodb.com/atlas) (offre gratuite M0 suffisante)
- Facultatif : [MongoDB Compass](https://www.mongodb.com/products/tools/compass) pour consulter les données, et le Nest CLI (`npm install -g @nestjs/cli`)

## 5. Installation

```bash
git clone https://github.com/MehdiKaouache/CampusRate.git
cd CampusRate
npm ci
```

## 6. Configurer MongoDB (Atlas)

1. Dans Atlas, créer un projet, puis un cluster gratuit (M0).
2. Dans **Database Access**, créer un utilisateur de base de données avec un mot de passe, limité au rôle `readWrite` sur la base `campusrate-dev` (principe du moindre privilège).
3. Dans **Network Access**, autoriser **uniquement votre adresse IP** (« Add Current IP Address »). Ne pas utiliser `0.0.0.0/0`.
4. Cliquer sur **Connect**, puis **Drivers**, et copier l'URI de connexion.
5. Dans l'URI, remplacer `<db_password>` par le mot de passe, **ajouter le nom de la base** à la fin de l'adresse du cluster (`/campusrate-dev`), et retirer les chevrons `<` `>`.

La base `campusrate-dev` et ses collections (`places`, `reviews`) sont créées automatiquement par Mongoose au démarrage, avec leurs index.

## 7. Créer le fichier `.env`

Le fichier `.env` contient des informations sensibles. **Il n'est jamais versionné** (il est dans `.gitignore`). Le fichier `.env.example` documente les variables sans secret.

```bash
cp .env.example .env
```

Puis modifier `.env` avec vos valeurs :

| Variable | Description | Obligatoire | Défaut |
|---|---|---|---|
| `MONGO_URI` | URI de connexion MongoDB, qui doit commencer par `mongodb://` ou `mongodb+srv://` | Oui | aucun |
| `CORS_ORIGINS` | Origines autorisées par CORS, séparées par des virgules | Oui | aucun |
| `PORT` | Port de l'API | Non | `3000` |

Exemple de `.env.example` :

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/campusrate-dev
CORS_ORIGINS=http://localhost:5173
```

Les variables sont validées au démarrage avec Joi. Si `MONGO_URI` ou `CORS_ORIGINS` est absente ou invalide, l'application refuse de démarrer avec un message d'erreur de validation explicite.

## 8. Démarrer l'application

```bash
npm run start:dev
```

L'API est disponible à l'adresse `http://localhost:3000/api/v1`. Si MongoDB est inaccessible (mauvais mot de passe, adresse IP non autorisée), l'erreur de connexion s'affiche dans le terminal.

## 9. Lint et compilation

```bash
npm run lint
npm run build
```

Ces deux commandes ne doivent produire aucune erreur ni aucun avertissement.

## 10. Documentation Swagger / OpenAPI

| Ressource | Adresse locale |
|---|---|
| Swagger UI | http://localhost:3000/docs |
| Document OpenAPI (JSON) | http://localhost:3000/docs/openapi.json |

Swagger décrit toutes les routes, les paramètres de filtre et de pagination, les champs obligatoires et leurs bornes (longueurs, minimum et maximum), les réponses de succès et les réponses d'erreur (`400`, `404`, `409`, `415`) avec le schéma Problem Details.

## 11. Contrat de l'API

Toutes les routes sont préfixées par `/api/v1`.

### Endroits (`places`)

| Méthode | URI | Description | Succès | Erreurs possibles |
|---|---|---|---|---|
| GET | `/places` | Lister les endroits (filtre et pagination) | 200 | 400 |
| GET | `/places/:id` | Consulter un endroit | 200 | 404 |
| POST | `/places` | Créer un endroit | 201 | 400, 415 |
| PATCH | `/places/:id` | Modifier partiellement un endroit | 200 | 400, 404, 415 |
| DELETE | `/places/:id` | Supprimer un endroit | 204 | 404, 409 |

### Appréciations (`reviews`)

| Méthode | URI | Description | Succès | Erreurs possibles |
|---|---|---|---|---|
| GET | `/places/:placeId/reviews` | Lister les appréciations d'un endroit | 200 | 404 |
| POST | `/places/:placeId/reviews` | Créer une appréciation pour un endroit | 201 | 400, 404, 415 |
| GET | `/reviews/:id` | Consulter une appréciation | 200 | 404 |
| PATCH | `/reviews/:id` | Modifier partiellement une appréciation | 200 | 400, 404, 415 |
| DELETE | `/reviews/:id` | Supprimer une appréciation | 204 | 404 |

Un endroit qui possède des appréciations ne peut pas être supprimé (`409 Conflict`).

### Filtrage et pagination

`GET /places` accepte les paramètres suivants :

| Paramètre | Type | Description |
|---|---|---|
| `category` | texte | Filtre exact sur la catégorie |
| `page` | entier | Page demandée (minimum 1, défaut 1) |
| `limit` | entier | Taille de page (1 à 100, défaut 10) |

```
GET /api/v1/places?category=LIBRARY&page=1&limit=10
```

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 10, "totalItems": 0, "totalPages": 0 }
}
```

### Format des erreurs

Toutes les erreurs suivent le format Problem Details (`application/problem+json`). Quand plusieurs règles échouent, `detail` contient le premier message et `errors` la liste complète.

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "L'adresse est obligatoire",
  "instance": "/api/v1/places",
  "errors": ["L'adresse est obligatoire", "L'adresse doit contenir entre 3 et 200 caracteres"]
}
```

Une erreur interne (`500`) retourne seulement un message générique : ni pile d'exécution, ni chemin local, ni détail technique.

## 12. Validations principales

Un `ValidationPipe` global applique `whitelist`, `forbidNonWhitelisted` et `transform`. Toute propriété inconnue provoque une erreur `400`.

**Endroit (création)**

| Champ | Règle |
|---|---|
| `name` | requis, texte de 2 à 100 caractères, au moins une lettre ou un chiffre |
| `description` | requis, texte de 5 à 500 caractères, au moins une lettre ou un chiffre |
| `category` | requis, une valeur parmi `STUDY_SPACE`, `LIBRARY`, `FOOD_SERVICE`, `SPORTS`, `STUDENT_SERVICE`, `COMPUTER_LAB`, `OTHER` |
| `address` | requis, texte de 3 à 200 caractères, au moins une lettre ou un chiffre |
| `services` | facultatif, tableau de textes (50 caractères maximum chacun), doublons retirés |
| `status` | facultatif, `ACTIVE`, `TEMPORARILY_CLOSED` ou `INACTIVE` (défaut `ACTIVE`) |

**Appréciation (création)**

| Champ | Règle |
|---|---|
| `authorName` | requis, texte de 2 à 50 caractères, au moins une lettre ou un chiffre |
| `rating` | requis, **entier** de 1 à 5 (la chaîne `"4"` est refusée) |
| `comment` | requis, texte de 3 à 1000 caractères, au moins une lettre ou un chiffre |

**Modification (`PATCH`)** : les mêmes règles s'appliquent à chaque propriété envoyée, toutes facultatives.

**Champs contrôlés par le serveur** : `id`, `placeId` (il vient de l'URL), `createdAt`, `updatedAt`, `averageRating` et `reviewCount` ne peuvent pas être envoyés par le client, ni à la création ni à la modification. Ils provoquent une erreur `400`.

**Contenu de la requête** : un `POST` ou un `PATCH` dont le `Content-Type` n'est pas `application/json` retourne `415`.

## 13. Sécurité

- **Aucun objet du client n'est transmis à MongoDB.** Le filtre de `GET /places` ne contient que `category`, une valeur déjà validée par l'énumération. Les mises à jour copient les champs un par un. Un corps comme `{"name": {"$ne": null}}` est refusé par la validation.
- **CORS** : seules les origines listées dans `CORS_ORIGINS` sont autorisées, avec les méthodes `GET`, `POST`, `PATCH`, `DELETE` et l'en-tête `Content-Type`. CORS limite ce que les **navigateurs** acceptent de lire. **Ce n'est pas une authentification** : `curl` ou Postman ne sont pas bloqués.
- **Helmet** ajoute des en-têtes HTTP de sécurité (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, politique de sécurité du contenu, etc.) et retire `X-Powered-By`. Il réduit certains risques côté navigateur, mais ne remplace ni la validation, ni l'authentification.
- **Secrets** : `.env` n'est jamais versionné, `.env.example` ne contient aucune valeur réelle, et la configuration est validée au démarrage.

## 14. Options réalisées

Seules les options réellement fonctionnelles et démontrables sont listées.

| Code | Option | Où |
|---|---|---|
| M2 | Agrégation MongoDB | `ReviewsRepository.getRatingStats` : `$match`, `$group` et `$avg` calculent la moyenne et le nombre d'appréciations |
| M3 | Référence plutôt qu'imbrication, justifiée | section 16 |
| P1 | Liste blanche de filtres | `PlacesRepository.buildFilter` n'accepte que `category` |
| P2 | Propriétés modifiables explicites | les services construisent `changes` champ par champ, et les DTO excluent les champs serveur |
| H3 | Vérification du `Content-Type` avec `415` | `ContentTypeMiddleware` |
| L1 | Journal des requêtes | `RequestLoggerMiddleware` : date, méthode, chemin, statut, durée |
| L2 | Journal des erreurs | `HttpExceptionFilter` : `WARN` pour les erreurs `4xx`, `ERROR` avec la pile d'exécution pour les `500`, **seulement dans le terminal du serveur** |
| T1 | Rôle de HTTPS | section 15 |

Le journal n'enregistre ni le corps des requêtes, ni les en-têtes, ni les variables d'environnement.

Options **non réalisées** : M1, H1, H2, H4, H5, T2, T3, T4, A1, A2.

## 15. HTTPS

HTTPS chiffre les échanges entre le client et le serveur avec TLS. Il empêche d'écouter ou de modifier les données en transit (attaque de l'homme du milieu) et protège les jetons et les mots de passe qui circuleraient dans les requêtes. En production, l'API doit être accessible **uniquement** en HTTPS, généralement derrière un serveur frontal qui gère le certificat.

En local, CampusRate fonctionne en HTTP simple. L'en-tête `Strict-Transport-Security` envoyé par Helmet demande aux navigateurs d'utiliser HTTPS, mais il est ignoré sur `http://localhost`.

## 16. Justification des choix de design

| Choix | Décision | Justification |
|---|---|---|
| Nom des ressources | `places`, `reviews` (anglais, pluriel) | Convention standard pour une API technique. Le pluriel représente une collection. |
| Versionnement | `/api/v1/...` | Permet de faire évoluer le contrat sans casser les clients existants. Changer la persistance ne justifie pas une nouvelle version. |
| Imbrication | `POST` et `GET /places/:placeId/reviews` (imbriqué), `GET`, `PATCH` et `DELETE /reviews/:id` (indépendant) | On imbrique quand il faut connaître le parent pour créer ou lister. L'identifiant d'une appréciation est unique, donc il suffit à la retrouver. |
| Codes de statut | 200, 201, 204, 400, 404, 409, 415 | Chaque code reflète précisément le résultat de l'opération. |
| Identifiant public | champ `id` (`plc_...`, `rev_...`), distinct de `_id` | Le contrat du TP1 reste identique. `_id` et `__v` ne sont jamais exposés. Un mapper choisit explicitement les champs retournés. |
| Collections | `places` et `reviews` séparées, `placeId` référence l'`id` public | Les appréciations peuvent devenir nombreuses (limite de 16 Mo par document), ont leur propre cycle de vie (`/reviews/:id`) et sont consultées indépendamment. |
| Valeurs calculées | `averageRating` et `reviewCount` stockés dans l'endroit | Lecture rapide. La valeur est recalculée par agrégation à chaque changement d'appréciation. |
| Index | `id` unique dans chaque collection, `{category, createdAt}` sur `places`, `{placeId, createdAt}` sur `reviews` | Recherche par identifiant, filtre par catégorie, appréciations d'un endroit. Aucun autre index n'est ajouté, car chacun ralentit les écritures. |
| Accès aux données | `repository` par ressource | Seul endroit qui utilise Mongoose. Les services gardent les règles métier. |

## 17. Tests manuels et collection Postman

La collection `postman/campusRate.postman_collection.json` contient 26 requêtes et 60 tests automatiques, répartis en cinq dossiers :

1. **Places** : création, consultation, modification, filtre, pagination.
2. **Reviews** : création, consultation, note moyenne recalculée, suppression.
3. **Scénarios de suppression** : suppression permise et conflit `409`.
4. **Validation et sécurité** : propriété absente, nom composé d'espaces, catégorie inconnue, note en texte, note hors limite, propriété inconnue, `id` imposé, `averageRating` dans un `PATCH`, objet d'injection NoSQL, `415`, `404`.
5. **Persistance** : lister les endroits avant et après un redémarrage de l'API.

Pour l'utiliser : importer le fichier dans Postman, démarrer l'API, puis exécuter la collection (**Run collection**).

## 18. Limites connues

- **Écritures non atomiques.** Le recalcul de la note moyenne se fait dans une seconde écriture, après la création, la modification ou la suppression d'une appréciation. Une panne entre les deux écritures peut laisser une moyenne périmée. Les transactions MongoDB régleraient ce problème.
- **Suppression d'un endroit.** La vérification « possède des appréciations » et la suppression sont deux opérations séparées. Une appréciation ajoutée entre les deux pourrait rester sans endroit.
- **Aucune authentification ni autorisation.** N'importe quel client peut modifier ou supprimer des données. Il n'y a pas de limitation de débit.
- **Swagger UI** est exposé dans tous les environnements. En production, il devrait être désactivé ou protégé.
- **Texte significatif.** Le contrôle accepte les lettres latines, les lettres accentuées françaises et les chiffres. Un nom écrit uniquement dans un autre alphabet est refusé.
- **Documentation des erreurs.** Dans Swagger, l'exemple de réponse d'erreur est le même pour tous les codes, et le type de média `application/problem+json` n'est pas annoncé. Le comportement réel de l'API est correct.
- **Recherche limitée.** Seul le filtre exact par catégorie existe. Il n'y a ni recherche textuelle ni tri.
- **HTTPS** n'est pas configuré localement.
- **Dépendances.** `npm audit` signale des vulnérabilités dans les dépendances. Elles n'ont pas été corrigées avec `--force`, pour éviter de casser les versions utilisées.

## 19. Structure du projet

```
src/
├── main.ts
├── app.module.ts
├── configure-swagger.ts
├── config/
│   └── env-validation.schema.ts
├── common/
│   ├── dto/
│   │   ├── pages-response.dto.ts
│   │   └── problem-details.dto.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── content-type.middleware.ts
│   │   └── request-logger.middleware.ts
│   ├── utils/
│   │   └── id-generator.ts
│   └── validation/
│       └── patterns.ts
├── places/
│   ├── places.module.ts
│   ├── places.controller.ts
│   ├── places.service.ts
│   ├── places.repository.ts
│   ├── dto/
│   ├── entities/
│   ├── mappers/
│   └── schemas/
└── reviews/
    ├── reviews.module.ts
    ├── reviews.service.ts
    ├── reviews.repository.ts
    ├── controller/
    ├── dto/
    ├── entities/
    ├── mappers/
    └── schemas/
```

## 20. Historique du développement (TP1 et TP2)

Le dépôt contient le travail des deux TP. La branche `main` contient l'état final du TP2. Les numéros de branches et d'issues se suivent d'un TP à l'autre, et la Pull Request #14 clôt le TP1.

| | TP1 | TP2 |
|---|---|---|
| Persistance | fichier JSON | MongoDB |
| Branches feature | `feature/01-places-api`, `feature/02-reviews-api` | `feature/03-mongodb-persistence`, `feature/04-validation-security` |
| Branches task | `task/versioning-config`, `task/02-...` à `task/11-...` | `task/12-...` à `task/19-...` |
| Issues | #1 à #13 | #15 à #24 |
| Étiquette Git | `tp1` | `tp2` |

Pour voir ce qui a changé entre les deux travaux : https://github.com/MehdiKaouache/CampusRate/compare/tp1...tp2