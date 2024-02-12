#!/bin/bash

if [ "$DB_TYPE" == "mysql" ]; then
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_HOST $MYSQL_DATABASE < /docker-entrypoint-initdb.d/initsql.sql
elif [ "$DB_TYPE" == "pg" ]; then
    #psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f /docker-entrypoint-initdb.d/initpg.sql
    docker exec -it postgres psql -U postgres -a -f /docker-entrypoint-initdb.d/initpg.sql
else
    echo "Unknown or unset DB_TYPE. Exiting."
    exit 1
fi
