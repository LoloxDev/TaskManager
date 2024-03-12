# TaskManager

Gestionnaire de tâches - Projet individuel - API WebServices - Efrei

Ce projet a été créé dans le cadre de mes études. Il s'agit d'une application de gestion de tâches.

## Prérequis

Avant de pouvoir exécuter ce projet localement, assurez-vous d'avoir installé les outils suivants sur votre machine :

- Node.js
- Docker

## Installation

1. Copiez le fichier .env en .env.local, et modifiez vos informations de base de donnée. Il est possible de choisir une base de donnée MYSQL ou PG.

2. Installez les dépendances du projet en exécutant la commande suivante :

```bash
npm install
```

## Démarrage du serveur

Pour lancer le serveur Node.js, utilisez la commande suivante :

```bash
npm start
```

## Gestion de la base de données

- Pour lancer le conteneur Docker de la base de données :

```bash
BDD Postgres :
docker-compose --env-file .env.local -f docker-compose.postgres.yml up -d
BDD Mysql :
docker-compose --env-file .env.local -f docker-compose.mysql.yml up -d
```

- Pour fermer le conteneur Docker de la base de données :

```bash
docker-compose down
```

- Pour accéder à la base de données depuis PSQL (terminal) :

```bash
docker exec -it postgres psql -U postgres
```

- Pour créer la base de données sur une nouvelle machine ( Normalement le script est éxécuté la première fois ) :

```bash
docker exec -i postgres sh -c '/bin/bash /docker-entrypoint-initdb.d/init.sh'
```

- Pour tester une requête SQL depuis la console :

```bash
docker exec -it postgres psql -U postgres -d taskmanager -c "SELECT * FROM tasks;"
```

- Pour supprimer le conteneur et donc la persistence des données :

```bash
docker rm postgres
```

## Docker Compose

Le Docker Compose crée un conteneur de base de données et copie les éléments du dossier `init-scripts` à l'intérieur du conteneur (`/docker-entrypoint-initdb.d`). Ces scripts servent à initialiser la base de données lors du premier démarrage ou après une réinitialisation.

Il va également copier un dossier data avec toutes les persistences de la base de données dans `data/postgresql` et à l'intérieur du conteneur (`/var/lib`).

Pour parcourir le conteneur Docker, utilisez la commande suivante :

```bash
docker exec -it postgres bash
```

## Accès à l'application

L'application sera accessible à l'adresse suivante : [http://localhost:3033](http://localhost:3033).

## Prochaines fonctionnalités

- Possibilité d'affecter un autre utilisateur à une tâche
- Menu utilisateur : Se déconnecter / Mon profil / ...
- Utilisateurs avec des rôles, superadmin / admin / chefDeProjet / developpeur / visiteur
- Compléter la dockerisation MYSQL.


---

Cette liste peut évoluer en fonction des besoins et des retours des utilisateurs.