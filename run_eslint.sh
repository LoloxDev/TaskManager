#!/bin/bash

# Installer les dépendances, y compris le formatteur JUnit
npm install
npm install -D eslint-formatter-junit

OUTPUT_FILE="eslint-result.xml"

# Exécuter ESLint et générer le rapport
npx eslint . -f junit -o $OUTPUT_FILE
ESLINT_EXIT_CODE=$?

# Afficher les erreurs de linting dans la console Jenkins
npx eslint . --format stylish

# Ne pas échouer le build en cas d'erreurs ESLint
if [ $ESLINT_EXIT_CODE -ne 0 ]; then
    echo "ESLint found issues in the code. Check the report for details."
    # Continuer l'exécution du script sans exit 1
fi

echo "ESLint completed with exit code $ESLINT_EXIT_CODE. Check the report for details."
