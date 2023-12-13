-- Suppression de la base de données si elle existe
DROP DATABASE IF EXISTS taskmanager;

-- Création de la base de données
CREATE DATABASE taskmanager;

-- Utilisation de la base de données
\c taskmanager;

-- Structure de la table `tasks`
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  isDone BOOLEAN NOT NULL,
  currentDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données dans la table `tasks`
INSERT INTO tasks (name, isDone, currentDate) VALUES
('Tâche test 1', FALSE, CURRENT_TIMESTAMP),
('Tâche test 2', TRUE, CURRENT_TIMESTAMP);

-- Affichage des données
SELECT * FROM tasks;
