# CampusRate

## 1. Description du projet

CampusRate est une API REST permettant à la communauté étudiante de consulter
des endroits ou services du campus et de publier des appréciations
accompagnées d'une note. Le projet a été conçu et développé individuellement
dans le cadre du cours 420-514 - Collecte et interprétation des données,
Techniques de l'informatique, Automne 2026.

## 2. Fonctionnalités

- Créer, consulter, modifier partiellement et supprimer un endroit (`place`)
- Créer, consulter, modifier partiellement et supprimer une appréciation
  (`review`) associée à un endroit
- Filtrer les endroits par catégorie
- Paginer la liste des endroits
- Calcul automatique de la note moyenne et du nombre d'appréciations d'un
  endroit, mis à jour à chaque création, modification ou suppression
  d'appréciation
- Validation complète des entrées (types, formats, valeurs autorisées,
  propriétés inconnues refusées)
- Gestion uniforme des erreurs au format Problem Details
  (`application/problem+json`)
- Persistance des données dans un fichier JSON local, conservée après un
  redémarrage
- Documentation interactive via Swagger UI

## 3. Technologies utilisées

- [NestJS](https://nestjs.com/) (TypeScript)
- [class-validator](https://github.com/typestack/class-validator) et
  [class-transformer](https://github.com/typestack/class-transformer) pour la
  validation des entrées
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) et
  [Joi](https://joi.dev/) pour la configuration par variables
  d'environnement
- [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) pour la
  documentation OpenAPI
- `node:fs/promises` pour la persistance JSON asynchrone
- Postman pour les essais manuels

## 4. Prérequis

- [Node.js](https://nodejs.org/) v22.12 ou plus récent
- npm (installé avec Node.js)
- Le [Nest CLI](https://docs.nestjs.com/cli/overview) (optionnel, utile pour
  le développement) :
  ```bash
  npm install -g @nestjs/cli
  ```

## 5. Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/MehdiKaouache/CampusRate.git
   cd CampusRate
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```

## 6. Configuration

L'application utilise des variables d'environnement, validées au démarrage
avec un schéma Joi. Un fichier `.env.example` documente les variables
attendues.

1. Copier le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```
2. Ajuster les valeurs si nécessaire :

   | Variable         | Description                          | Obligatoire | Valeur par défaut         |
   |------------------|----------------------------------------|-------------|------------------------------|
   | `PORT`           | Port sur lequel l'API démarre         | Non         | `3000`                       |
   | `DATA_FILE_PATH` | Chemin du fichier JSON de persistance | Oui         | Aucune (erreur si absente)  |

   Si `DATA_FILE_PATH` est absente ou invalide, l'application refuse de
   démarrer et affiche une erreur de validation explicite au lancement.

## 7. Démarrage de l'application

```bash
npm run start:dev
```

L'API démarre par défaut à l'adresse suivante :
```
http://localhost:3000/api/v1
```

## 8. Lint et compilation

Avant toute remise, exécuter :

```bash
npm run lint
npm run build
```

Ces deux commandes ne doivent produire aucune erreur.

## 9. Documentation Swagger / OpenAPI

Une fois l'application démarrée, la documentation interactive est disponible
aux adresses suivantes :

| Ressource                | Adresse locale                         |
|---------------------------|------------------------------------------|
| Swagger UI                 | http://localhost:3000/docs               |
| Document OpenAPI (JSON)    | http://localhost:3000/docs/openapi.json  |

Swagger UI permet de consulter toutes les routes, leurs paramètres, les
schémas de requête et de réponse, ainsi que d'envoyer des requêtes de test
directement depuis le navigateur.

## 10. Contrat de l'API

Toutes les routes sont préfixées par `/api/v1`.

### Endroits (`places`)

| Méthode | URI            | Description                                | Succès | Erreurs possibles |
|---------|-----------------|----------------------------------------------|--------|--------------------|
| GET     | `/places`        | Lister les endroits (filtre + pagination)    | 200    | 400 |
| GET     | `/places/:id`     | Consulter un endroit                        | 200    | 404 |
| POST    | `/places`         | Créer un endroit                            | 201    | 400 |
| PATCH   | `/places/:id`     | Modifier partiellement un endroit           | 200    | 400, 404 |
| DELETE  | `/places/:id`     | Supprimer un endroit                        | 204    | 404, 409 |

### Appréciations (`reviews`)

| Méthode | URI                          | Description                                  | Succès | Erreurs possibles |
|---------|--------------------------------|-------------------------------------------------|--------|--------------------|
| GET     | `/places/:placeId/reviews`      | Lister les appréciations d'un endroit          | 200    | 404 |
| POST    | `/places/:placeId/reviews`      | Créer une appréciation pour un endroit         | 201    | 400, 404 |
| GET     | `/reviews/:id`                  | Consulter une appréciation                     | 200    | 404 |
| PATCH   | `/reviews/:id`                  | Modifier partiellement une appréciation        | 200    | 400, 404 |
| DELETE  | `/reviews/:id`                  | Supprimer une appréciation                     | 204    | 404 |

### Filtrage et pagination

`GET /places` accepte les paramètres de requête suivants :

| Paramètre  | Type    | Description                          |
|------------|---------|------------------------------------------|
| `category` | string  | Filtre exact sur la catégorie             |
| `page`     | number  | Page demandée (défaut : 1)                |
| `limit`    | number  | Taille de page (défaut : 10, maximum 100) |

Exemple :
```
GET /api/v1/places?category=LIBRARY&page=1&limit=10
```

Réponse :
```json
{
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 4,
    "totalPages": 1
  }
}
```

### Format des erreurs

Toutes les erreurs suivent le format Problem Details
(`application/problem+json`) :

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Aucun endroit ne possede l'identifiant plc_inexistant.",
  "instance": "/api/v1/places/plc_inexistant"
}
```

## 11. Justification des choix de design

| Choix                        | Décision                                   | Justification |
|-------------------------------|---------------------------------------------|------------------|
| **Nom des ressources**         | `places`, `reviews` (anglais, pluriel)      | L'anglais est la convention standard pour une API technique. Le pluriel reflète le fait que l'URI représente une collection de ressources (`GET /places` retourne l'ensemble des endroits, pas un seul). |
| **Versionnement**              | `/api/v1/...` (URI, version majeure)        | Permet de maintenir plusieurs contrats en parallèle si une évolution incompatible du contrat devient nécessaire plus tard, sans casser les clients existants qui utilisent déjà `/v1`. |
| **Imbrication des routes**     | `POST /places/:id/reviews` (imbriqué) vs `PATCH/DELETE /reviews/:id` (indépendant) | On imbrique une route lorsque l'action nécessite de connaître la ressource parente pour identifier ou créer la ressource enfant (lister ou créer les appréciations **d'un** endroit précis). On utilise une route indépendante lorsque l'identifiant de la ressource est globalement unique et suffit à lui seul à la retrouver (consulter, modifier ou supprimer **une** appréciation précise, peu importe l'endroit auquel elle appartient). |
| **Codes de statut**            | 200 (lecture), 201 (création), 204 (suppression), 400 (entrée invalide), 404 (introuvable), 409 (conflit) | Chaque code reflète précisément le résultat de l'opération, conformément aux conventions HTTP standards, plutôt que de toujours retourner 200 peu importe le résultat. |
| **Génération des identifiants**| `plc_` et `rev_` suivis d'une valeur unique | Le préfixe permet d'identifier immédiatement le type de ressource à partir de son identifiant seul, sans avoir besoin de contexte additionnel (pratique inspirée de standards d'API réels, comme Stripe). |
| **Persistance**                | Fichier JSON unique avec deux collections (`places`, `reviews`) | Répond à l'exigence du TP d'une persistance simple par fichier, sans dépendance à un serveur de base de données externe, tout en respectant la relation logique entre les deux ressources. |

## 12. Tests manuels et collection Postman

Une collection Postman est fournie dans le dépôt
(`postman/campusRate.postman_collection.json`) et couvre les scénarios
suivants :

1. Création d'un endroit
2. Consultation d'un endroit
3. Création d'une appréciation pour cet endroit
4. Consultation d'une appréciation
5. Modification partielle d'un endroit
6. Suppression d'une appréciation
7. Suppression d'un endroit sans appréciation (succès)
8. Tentative de suppression d'un endroit avec appréciation (409 Conflict)
9. Création d'une appréciation avec une note invalide (400 Bad Request)
10. Consultation d'un endroit inexistant (404 Not Found)
11. Filtrage des endroits par catégorie
12. Pagination de la liste des endroits

Pour importer la collection : ouvrir Postman, `Import`, sélectionner le
fichier JSON fourni.

## 13. Limites connues

- **Persistance concurrente** : la persistance repose sur un fichier JSON
  unique, lu et réécrit en entier à chaque opération. En cas de requêtes
  concurrentes simultanées (par exemple deux créations envoyées exactement en
  même temps), une modification peut être écrasée par une autre (situation de
  compétition, ou *race condition*). Une base de données transactionnelle
  réglerait ce problème, mais dépasse la portée de ce TP.
- **Absence d'authentification** : les opérations sensibles (modification,
  suppression) ne sont pas protégées par un mécanisme d'authentification ou
  d'autorisation. N'importe quel consommateur de l'API peut effectuer
  n'importe quelle opération.
- **Recherche limitée** : le filtrage des endroits ne permet actuellement
  qu'un filtre exact par catégorie. Une recherche textuelle sur le nom ou la
  description n'est pas prise en charge.
- **Pas de tests automatisés** : les vérifications ont été effectuées
  manuellement (curl, Swagger UI, Postman). Aucune suite de tests unitaires
  ou d'intégration automatisée (Jest, Supertest) n'a été mise en place.

## 14. Structure du projet

```
src/
├── main.ts
├── app.module.ts
├── configure-swagger.ts
├── config/
│   └── env-validation.schema.ts
├── common/
│   ├── common.module.ts
│   ├── dto/
│   │   └── pages-response.dto.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── persistence/
│   │   ├── database.types.ts
│   │   └── json-database.service.ts
│   └── utils/
│       └── id-generator.ts
├── places/
│   ├── places.module.ts
│   ├── places.controller.ts
│   ├── places.service.ts
│   ├── dto/
│   │   ├── create-place.dto.ts
│   │   ├── update-place.dto.ts
│   │   └── find-places-query.dto.ts
│   └── entities/
│       ├── place.entity.ts
│       ├── place-category.enum.ts
│       └── place-status.enum.ts
└── reviews/
    ├── reviews.module.ts
    ├── reviews.service.ts
    ├── controller/
    │   ├── reviews.controller.ts
    │   └── reviews-detail.controller.ts
    ├── dto/
    │   ├── create-review.dto.ts
    │   └── update-review.dto.ts
    └── entities/
        └── review.entity.ts
```