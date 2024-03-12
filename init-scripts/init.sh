if [ "$DB_TYPE" == "mysql" ]; then
    echo "Base de donnée MYSQL détéctée. ✅"
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_HOST $MYSQL_DATABASE < ./db-init/initsql.sql
elif [ "$DB_TYPE" == "postgres" ]; then
    echo "Base de donnée POSTGRES détéctée. ✅"
    psql -U postgres -d taskmanager -a -f /docker-entrypoint-initdb.d/db-init/initpg.sql
else
    echo "Base de donnée non reconnue! ❌"
    exit 1
fi
