# TaskManager

Gestionnaire de tâches - Projet individuel - API WebServices - Efrei

Ce projet a été créé dans le cadre de mes études. Il s'agit d'une application de gestion de tâches.

## Prérequis

Avant de pouvoir exécuter ce projet localement, assurez-vous d'avoir installé les outils suivants sur votre machine :

- Node.js : Téléchargez et installez Node.js pour exécuter l'application.

## Installation

1. À la racine du projet, vous trouverez un fichier d'import de base de données. Importez ce fichier dans votre système de gestion de base de données pour initialiser la base de données de l'application.

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
docker-compose up -d
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

- Pour supprimer le répertoire de sauvegarde de la base de données localement (Attention : cela supprime la base de données) :

```bash
sudo rm -rf /home/lolo/Projects/TaskManager/data/postgres/*
```

## Docker Compose

Le Docker Compose crée un conteneur de base de données et copie les éléments du dossier `init-scripts` à l'intérieur du conteneur (`/docker-entrypoint-initdb.d`). Ces scripts servent à initialiser la base de données lors du premier démarrage ou après une réinitialisation.

Pour accéder au conteneur Docker, utilisez la commande suivante :

```bash
docker-compose exec mon_postgres bash
```

## Accès à l'application

L'application sera accessible à l'adresse suivante : [http://localhost:3033](http://localhost:3033).

## Prochaines fonctionnalités

- Possibilité d'affecter un autre utilisateur à une tâche
- Menu utilisateur : Se déconnecter / Mon profil / ...
- Utilisateurs avec des rôles, superadmin / admin / chefDeProjet / developpeur / visiteur


---

Cette liste peut évoluer en fonction des besoins et des retours des utilisateurs.