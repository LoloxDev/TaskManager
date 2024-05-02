if [ "$DB_TYPE" == "mysql" ]; then
    echo "Base de données MySQL détectée. ✅"
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_HOST $MYSQL_DATABASE < ./db-init/initsql.sql
elif [ "$DB_TYPE" == "postgres" ]; then
    echo "Base de données PostgreSQL détectée. ✅"
    psql -U $POSTGRES_USER -d $POSTGRES_DB -f docker-entrypoint-initdb.d/db-init/initpg.sql
else
    echo "Base de données non reconnue! ❌"
    exit 1
fi
