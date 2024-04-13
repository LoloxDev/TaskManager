-- Connexion à la base de données taskmanager
\set dbname `echo $DB_NAME`

-- Structure de la table `tasks`
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  isDone BOOLEAN NOT NULL,
  currentDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Structure de la table `users`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

-- Structure de la table `user_tasks`
CREATE TABLE IF NOT EXISTS user_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id)
    ON DELETE CASCADE
);

-- Structure de la table `groups`
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

-- Structure de la table `categorys`
CREATE TABLE IF NOT EXISTS categorys (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

-- Structure de la table `projects`
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  id_group INTEGER REFERENCES groups(id),
  id_user INTEGER REFERENCES users(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Structure de la table `task_categorys`
CREATE TABLE IF NOT EXISTS task_categorys (
  id SERIAL PRIMARY KEY,
  id_tasks INTEGER REFERENCES tasks(id),
  id_category INTEGER REFERENCES categorys(id)
);

-- La base a été construite avec succès. ✅
