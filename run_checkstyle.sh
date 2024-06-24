#!/bin/bash

# Définir les chemins relatifs
CHECKSTYLE_CONFIG="checkstyle_configuration.xml"
SOURCE_DIRECTORY="server"  # Assurez-vous que le chemin est correct
OUTPUT_FILE="checkstyle-result.xml"
CHECKSTYLE_JAR="checkstyle-all.jar"

# Vérifier si Checkstyle JAR est présent
if [ ! -f "$CHECKSTYLE_JAR" ]; then
    echo "Checkstyle JAR not found: $CHECKSTYLE_JAR"
    exit 1
fi

# Vérifier si le fichier de configuration existe
if [ ! -f "$CHECKSTYLE_CONFIG" ]; then
    echo "Checkstyle configuration file not found: $CHECKSTYLE_CONFIG"
    exit 1
fi

# Vérifier si le répertoire source existe
if [ ! -d "$SOURCE_DIRECTORY" ]; then
    echo "Source directory not found: $SOURCE_DIRECTORY"
    exit 1
fi

# Exécuter Checkstyle
echo "Running Checkstyle..."
java -jar $CHECKSTYLE_JAR -c $CHECKSTYLE_CONFIG $SOURCE_DIRECTORY > $OUTPUT_FILE
CHECKSTYLE_EXIT_CODE=$?

if [ $CHECKSTYLE_EXIT_CODE -ne 0 ]; then
    echo "Checkstyle execution failed with exit code $CHECKSTYLE_EXIT_CODE"
    exit $CHECKSTYLE_EXIT_CODE
fi

echo "Checkstyle completed successfully"
