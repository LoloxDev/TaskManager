#!/bin/bash

if [ "$DB_TYPE" == "mysql" ]; then
    psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f /docker-entrypoint-initdb.d/init-mysql.sql
elif [ "$DB_TYPE" == "pg" ]; then
    psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f /docker-entrypoint-initdb.d/init-postgres.sql
else
    echo "Unknown or unset DB_TYPE. Exiting."
    exit 1
fi
