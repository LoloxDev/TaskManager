-- Suppression de la base de données si elle existe
DROP DATABASE IF EXISTS taskmanager;

-- Création de la base de données
CREATE DATABASE taskmanager;

-- Connexion à la base de données taskmanager
\c taskmanager

-- Structure de la table `tasks`
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  isDone BOOLEAN NOT NULL,
  currentDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Structure de la table `utilisateur`
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

-- Structure de la table `user_tasks`
CREATE TABLE user_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id)
);
