#!/bin/bash

npm install
npm install -D eslint-formatter-junit

OUTPUT_FILE="eslint-result.xml"

# éxecution de esling et génération du rapport
npx eslint . -f junit -o $OUTPUT_FILE
ESLINT_EXIT_CODE=$?

# affichage des erreurs dans jenkins
npx eslint . --format stylish

# ne pas échouer le build en cas d'erreurs
if [ $ESLINT_EXIT_CODE -ne 0 ]; then
    echo "Des erreurs ESLint ont été détéctés, ouvrir le rapport pour les détails."
fi

echo "EsLint ok : $ESLINT_EXIT_CODE. Ouvrir le rapport pour les détails."
