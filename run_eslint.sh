#!/bin/bash

# Installer les dépendances, y compris le formatteur JUnit
npm install
npm install -D eslint-formatter-junit

OUTPUT_FILE="eslint-result.xml"

# Exécuter ESLint
npx eslint . -f junit -o $OUTPUT_FILE
ESLINT_EXIT_CODE=$?

if [ $ESLINT_EXIT_CODE -ne 0 ]; then
    echo "ESLint execution failed with exit code $ESLINT_EXIT_CODE"
    exit $ESLINT_EXIT_CODE
fi

echo "ESLint completed successfully"
