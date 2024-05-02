if [ "$DB_TYPE" == "mysql" ]; then
    echo "Base de données MySQL détectée. ✅"
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $MYSQL_HOST $MYSQL_DATABASE < ./db-init/initsql.sql
    echo "La base de données MySQL a été construite avec succès. ✅"
elif [ "$DB_TYPE" == "postgres" ]; then
    echo "Base de données PostgreSQL détectée. ✅"
    psql -U $POSTGRES_USER -d $POSTGRES_DB -f docker-entrypoint-initdb.d/db-init/initpg.sql
    if [ $? -eq 0 ]; then
        echo "La base de données PostgreSQL a été construite avec succès. ✅"
    else
        echo "Erreur lors de la construction de la base de données PostgreSQL. ❌"
    fi
else
    echo "Base de données non reconnue! ❌"
    exit 1
fi
