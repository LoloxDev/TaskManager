# TaskManager
Gestionnaire de taches - Projet individuel - API WebServices - Efrei

Ce projet a été créé dans le cadre de mes études. Il s'agit d'une application de gestion de tâches.

Avant de pouvoir exécuter ce projet localement, assurez-vous d'avoir installé les outils suivants sur votre machine :

Node.js : Téléchargez et installez Node.js pour exécuter l'application.

À la racine du projet, vous trouverez un fichier d'import de base de données. Importez ce fichier dans votre système de gestion de base de données pour initialiser la base de données de l'application.

Installez les dépendances du projet en exécutant la commande suivante :

npm i

Pour lancer le serveur node :

npx nodemon back/server

Pour fermer le conteneur docker de la BDD : 

docker-compose down

Pour lancer le conteneur docker de la BDD :

docker-compose up -d

Pour accéder à la BDD depuis PSQL ( terminal ) :

podman exec -it postgres psql -U postgres

Pour créer la BDD sur une nouvelle machine :

podman exec -i postgres psql -U postgres < init.sql

Pour tester une requête SQL depuis la console : 

podman exec -it postgres psql -U postgres -d taskmanager -c "SELECT * FROM tasks;"

Pour supprimer le répertoire de BDD de sauvegarde en local ( Attention supprime la BDD ) :

sudo rm -rf /home/lolo/Projects/TaskManager/data/postgres/*




L'application sera accessible à l'adresse suivante : http://localhost:3033.

Pour accéder à l'application, utilisez le token suivant : tachemania.


A venir dans les prochaines versions :

    - Possibilité d'affecter un autre utilisateur à une tache
    - Menu utilisateur : Se déconnecter / Mon profil / ...
    -

