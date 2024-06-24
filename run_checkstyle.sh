#!/bin/bash

# Définir les chemins relatifs
CHECKSTYLE_CONFIG="checkstyle_configuration.xml"
SOURCE_DIRECTORY="src"
OUTPUT_FILE="checkstyle-result.xml"

# Exécuter Checkstyle
checkstyle -c $CHECKSTYLE_CONFIG $SOURCE_DIRECTORY > $OUTPUT_FILE
